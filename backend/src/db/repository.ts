/**
 * Tenant-Isolated Base Repository Abstraction
 * Standards: OWASP API Security Top 10 (API1: BOLA / IDOR Prevention), HIPAA Security Rule
 * Security Requirements Owned: S5 (Strict Object-Level Authorization), S7 (Parameterized Prepared Statements)
 */

import { Queryable } from '../core/audit';

/**
 * Standard 404 Exception for missing or cross-tenant unauthorized entity access.
 * Returns HTTP 404 (never 403) to prevent entity existence enumeration.
 */
export class TenantNotFoundError extends Error {
  public readonly statusCode: number = 404;
  public readonly code: string = 'RESOURCE_NOT_FOUND';

  constructor(resource: string = 'Resource', id?: string) {
    super(`${resource}${id ? ` with id '${id}'` : ''} not found.`);
    this.name = 'TenantNotFoundError';
    Object.setPrototypeOf(this, TenantNotFoundError.prototype);
  }
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function assertValidIdentifier(name: string, description: string): void {
  if (!IDENTIFIER_REGEX.test(name)) {
    throw new Error(`Security Exception: Invalid ${description} identifier '${name}'.`);
  }
}

/**
 * Generic Tenant-Isolated Repository Base Class.
 * Enforces `WHERE user_id = :userId` on EVERY query.
 */
export class BaseTenantRepository<T extends Record<string, any>> {
  protected readonly db: Queryable;
  public readonly tableName: string;
  public readonly entityName: string;
  protected readonly allowedColumns: Set<string>;

  constructor(
    db: Queryable,
    tableName: string,
    entityName: string = 'Resource',
    allowedColumns: string[] = []
  ) {
    assertValidIdentifier(tableName, 'table name');
    this.db = db;
    this.tableName = tableName;
    this.entityName = entityName;
    this.allowedColumns = new Set(allowedColumns);
  }

  /**
   * Find a single record by entity id and authenticated user_id.
   * Returns null if missing or belongs to a different tenant.
   */
  async findById(userId: string, id: string): Promise<T | null> {
    if (!userId || !id) return null;

    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE id = $1 AND user_id = $2
      LIMIT 1;
    `;

    const result = await this.db.query(sql, [id, userId]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as T;
  }

  /**
   * Find a single record or throw TenantNotFoundError (HTTP 404).
   */
  async findByIdOrThrow(userId: string, id: string): Promise<T> {
    const record = await this.findById(userId, id);
    if (!record) {
      throw new TenantNotFoundError(this.entityName, id);
    }
    return record;
  }

  /**
   * List all records strictly owned by the authenticated tenant.
   */
  async findAll(userId: string, options: QueryOptions = {}): Promise<T[]> {
    if (!userId) return [];

    const params: any[] = [userId];
    let sql = `SELECT * FROM ${this.tableName} WHERE user_id = $1`;

    if (options.orderBy) {
      assertValidIdentifier(options.orderBy, 'order by column');
      if (this.allowedColumns.size > 0 && !this.allowedColumns.has(options.orderBy)) {
        throw new Error(`Security Exception: Column '${options.orderBy}' is not allowed for sorting.`);
      }
      const dir = options.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${options.orderBy} ${dir}`;
    }

    if (options.limit !== undefined && options.limit > 0) {
      params.push(Math.min(options.limit, 100)); // Cap limit to 100 max per API safety
      sql += ` LIMIT $${params.length}`;
    }

    if (options.offset !== undefined && options.offset >= 0) {
      params.push(options.offset);
      sql += ` OFFSET $${params.length}`;
    }

    const result = await this.db.query(sql, params);
    return result.rows as T[];
  }

  /**
   * Query records owned by the tenant matching additional column filters.
   */
  async findMany(
    userId: string,
    filters: Record<string, any>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    if (!userId) return [];

    const params: any[] = [userId];
    const clauses: string[] = ['user_id = $1'];

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined) continue;
      assertValidIdentifier(key, 'filter column');
      if (this.allowedColumns.size > 0 && !this.allowedColumns.has(key)) {
        throw new Error(`Security Exception: Column '${key}' is not allowed for filtering.`);
      }
      params.push(value);
      clauses.push(`${key} = $${params.length}`);
    }

    let sql = `SELECT * FROM ${this.tableName} WHERE ${clauses.join(' AND ')}`;

    if (options.orderBy) {
      assertValidIdentifier(options.orderBy, 'order by column');
      const dir = options.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${options.orderBy} ${dir}`;
    }

    if (options.limit !== undefined && options.limit > 0) {
      params.push(Math.min(options.limit, 100));
      sql += ` LIMIT $${params.length}`;
    }

    if (options.offset !== undefined && options.offset >= 0) {
      params.push(options.offset);
      sql += ` OFFSET $${params.length}`;
    }

    const result = await this.db.query(sql, params);
    return result.rows as T[];
  }

  /**
   * Insert a new record strictly enforcing user_id ownership.
   */
  async create(userId: string, data: Partial<T>): Promise<T> {
    if (!userId) {
      throw new Error('Tenant user_id is mandatory to insert record.');
    }

    const payload = { ...data, user_id: userId };
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      throw new Error('Cannot insert empty entity.');
    }

    for (const key of keys) {
      assertValidIdentifier(key, 'insert column');
    }

    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map(k => (payload as any)[k]);

    const sql = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await this.db.query(sql, values);
    return result.rows[0] as T;
  }

  /**
   * Update a record strictly bounded by entity id AND user_id.
   * Returns null if not found or belongs to another tenant.
   */
  async update(userId: string, id: string, data: Partial<T>): Promise<T | null> {
    if (!userId || !id) return null;

    const updateEntries = Object.entries(data).filter(
      ([k]) => k !== 'id' && k !== 'user_id' && k !== 'created_at'
    );

    if (updateEntries.length === 0) {
      return this.findById(userId, id);
    }

    for (const [key] of updateEntries) {
      assertValidIdentifier(key, 'update column');
    }

    const params: any[] = [id, userId];
    const setClauses = updateEntries.map(([key, val]) => {
      params.push(val);
      return `${key} = $${params.length}`;
    });

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await this.db.query(sql, params);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as T;
  }

  /**
   * Update a record or throw TenantNotFoundError (HTTP 404).
   */
  async updateOrThrow(userId: string, id: string, data: Partial<T>): Promise<T> {
    const updated = await this.update(userId, id, data);
    if (!updated) {
      throw new TenantNotFoundError(this.entityName, id);
    }
    return updated;
  }

  /**
   * Delete a record strictly filtered by entity id AND user_id.
   * Returns true if deleted, false if record was not found or owned by another tenant.
   */
  async delete(userId: string, id: string): Promise<boolean> {
    if (!userId || !id) return false;

    const sql = `
      DELETE FROM ${this.tableName}
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await this.db.query(sql, [id, userId]);
    return (result.rowCount ?? result.rows.length) > 0;
  }

  /**
   * Delete a record or throw TenantNotFoundError (HTTP 404).
   */
  async deleteOrThrow(userId: string, id: string): Promise<void> {
    const deleted = await this.delete(userId, id);
    if (!deleted) {
      throw new TenantNotFoundError(this.entityName, id);
    }
  }

  /**
   * Sovereign Purge (S9): Delete all records for a user across this table.
   */
  async deleteAllForUser(userId: string): Promise<number> {
    if (!userId) return 0;

    const sql = `DELETE FROM ${this.tableName} WHERE user_id = $1;`;
    const result = await this.db.query(sql, [userId]);
    return result.rowCount ?? result.rows.length;
  }

  /**
   * Count records owned by the tenant.
   */
  async count(userId: string): Promise<number> {
    if (!userId) return 0;

    const sql = `SELECT COUNT(*)::int AS count FROM ${this.tableName} WHERE user_id = $1;`;
    const result = await this.db.query(sql, [userId]);
    return parseInt(result.rows[0]?.count ?? '0', 10);
  }
}
