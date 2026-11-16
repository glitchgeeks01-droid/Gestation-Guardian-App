/**
 * In-Memory Fallback Database Client implementing Queryable
 * Conforms to PostgreSQL parameterized SQL query semantics.
 * Scope: backend/src/modules/db_memory.ts
 */

import type { Queryable } from '../core/audit';
import { getDatabasePool, setDatabasePool } from '../db/index';

export class InMemoryDatabase implements Queryable {
  public tables: Map<string, Array<Record<string, any>>> = new Map();
  public queries: Array<{ sql: string; params: any[] }> = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.queries = [];
    this.tables = new Map([
      ['users', []],
      ['consent_log', []],
      ['profiles', []],
      ['health_entries', []],
      ['appointments', []],
      ['documents', []],
      ['audit_log', []],
      ['settings', []]
    ]);
  }

  getTable(name: string): Array<Record<string, any>> {
    let table = this.tables.get(name);
    if (!table) {
      table = [];
      this.tables.set(name, table);
    }
    return table;
  }

  async query(sql: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    this.queries.push({ sql, params });
    const trimmed = sql.trim();

    // 1. Audit Log Append-Only Protection (S16)
    if (/UPDATE\s+audit_log/i.test(trimmed)) {
      throw new Error('Security Violation: audit_log table is append-only. UPDATE operations are prohibited.');
    }
    if (/DELETE\s+FROM\s+audit_log/i.test(trimmed)) {
      throw new Error('Security Violation: audit_log table is append-only. DELETE operations are prohibited.');
    }

    // 2. Audit Log INSERT
    if (/INSERT\s+INTO\s+audit_log/i.test(trimmed)) {
      const table = this.getTable('audit_log');
      const row = {
        id: `audit-uuid-${Date.now()}-${table.length + 1}`,
        timestamp: params[0] || new Date().toISOString(),
        user_id: params[1],
        action: params[2],
        resource_type: params[3],
        resource_id: params[4],
        ip_address: params[5],
        status: params[6]
      };
      table.push(row);
      return { rows: [row], rowCount: 1 };
    }

    // 3. Generic INSERT
    const insertMatch = trimmed.match(/INSERT\s+INTO\s+([a-zA-Z_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (insertMatch) {
      const tableName = insertMatch[1];
      const columnNames = insertMatch[2].split(',').map(c => c.trim());
      const table = this.getTable(tableName);

      const record: Record<string, any> = {
        id: `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        created_at: new Date().toISOString()
      };

      columnNames.forEach((col, idx) => {
        record[col] = params[idx];
      });

      if (!record.id && params[0]) {
        record.id = params[0];
      }

      table.push(record);
      return { rows: [record], rowCount: 1 };
    }

    // 4. SELECT
    const selectMatch = trimmed.match(/SELECT\s+(.*?)\s+FROM\s+([a-zA-Z_]+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY.*?)?(?:\s+LIMIT.*?)?$/is);
    if (selectMatch) {
      const tableName = selectMatch[2];
      const whereClause = selectMatch[3] ? selectMatch[3].trim() : '';
      const table = this.getTable(tableName);

      // COUNT query
      if (/COUNT\(\*\)/i.test(trimmed)) {
        if (/WHERE\s+user_id\s*=\s*\$1/i.test(whereClause)) {
          const userId = params[0];
          const count = table.filter(r => r.user_id === userId).length;
          return { rows: [{ count }], rowCount: 1 };
        }
        return { rows: [{ count: table.length }], rowCount: 1 };
      }

      // Filter by id AND user_id: WHERE id = $1 AND user_id = $2
      if (/id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(whereClause)) {
        const id = params[0];
        const userId = params[1];
        const found = table.find(r => r.id === id && r.user_id === userId);
        return { rows: found ? [{ ...found }] : [], rowCount: found ? 1 : 0 };
      }

      // Filter by user_id only: WHERE user_id = $1
      if (/^user_id\s*=\s*\$1/i.test(whereClause)) {
        const userId = params[0];
        let matches = table.filter(r => r.user_id === userId);

        // Sorting
        if (/ORDER\s+BY\s+entry_date\s+DESC/i.test(trimmed)) {
          matches.sort((a, b) => new Date(b.entry_date || b.created_at).getTime() - new Date(a.entry_date || a.created_at).getTime());
        } else if (/ORDER\s+BY\s+scheduled_at/i.test(trimmed)) {
          matches.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
        }

        return { rows: matches.map(m => ({ ...m })), rowCount: matches.length };
      }

      // Filter by email: WHERE email = $1
      if (/email\s*=\s*\$1/i.test(whereClause)) {
        const email = params[0];
        const found = table.find(r => r.email === email);
        return { rows: found ? [{ ...found }] : [], rowCount: found ? 1 : 0 };
      }

      // Filter by phone: WHERE phone = $1
      if (/phone\s*=\s*\$1/i.test(whereClause)) {
        const phone = params[0];
        const found = table.find(r => r.phone === phone);
        return { rows: found ? [{ ...found }] : [], rowCount: found ? 1 : 0 };
      }

      // Filter by id only: WHERE id = $1
      if (/id\s*=\s*\$1/i.test(whereClause)) {
        const id = params[0];
        const found = table.find(r => r.id === id);
        return { rows: found ? [{ ...found }] : [], rowCount: found ? 1 : 0 };
      }

      return { rows: table.map(m => ({ ...m })), rowCount: table.length };
    }

    // 5. UPDATE
    const updateMatch = trimmed.match(/UPDATE\s+([a-zA-Z_]+)\s+SET\s+(.*?)\s+WHERE\s+(.*?)(?:\s+RETURNING.*)?$/is);
    if (updateMatch) {
      const tableName = updateMatch[1];
      const whereClause = updateMatch[3].trim();
      const table = this.getTable(tableName);

      // UPDATE by id AND user_id: WHERE id = $1 AND user_id = $2
      if (/id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(whereClause)) {
        const id = params[0];
        const userId = params[1];
        const index = table.findIndex(r => r.id === id && r.user_id === userId);
        if (index === -1) {
          return { rows: [], rowCount: 0 };
        }
        const updated = { ...table[index] };
        // Apply column values from params starting after id & userId (index 2+)
        const setCols = updateMatch[2].split(',').map(s => s.trim().split('=')[0].trim());
        setCols.forEach((col, i) => {
          if (params[2 + i] !== undefined) {
            updated[col] = params[2 + i];
          }
        });
        updated.updated_at = new Date().toISOString();
        table[index] = updated;
        return { rows: [{ ...updated }], rowCount: 1 };
      }

      // UPDATE by user_id: WHERE user_id = $1
      if (/user_id\s*=\s*\$1/i.test(whereClause)) {
        const userId = params[0];
        const index = table.findIndex(r => r.user_id === userId);
        if (index === -1) {
          return { rows: [], rowCount: 0 };
        }
        const updated = { ...table[index] };
        const setCols = updateMatch[2].split(',').map(s => s.trim().split('=')[0].trim());
        setCols.forEach((col, i) => {
          if (params[1 + i] !== undefined) {
            updated[col] = params[1 + i];
          }
        });
        updated.updated_at = new Date().toISOString();
        table[index] = updated;
        return { rows: [{ ...updated }], rowCount: 1 };
      }

      return { rows: [], rowCount: 0 };
    }

    // 6. DELETE
    const deleteMatch = trimmed.match(/DELETE\s+FROM\s+([a-zA-Z_]+)\s+WHERE\s+(.*?)(?:\s+RETURNING.*)?$/is);
    if (deleteMatch) {
      const tableName = deleteMatch[1];
      const whereClause = deleteMatch[2].trim();
      const table = this.getTable(tableName);

      // DELETE by id AND user_id: WHERE id = $1 AND user_id = $2
      if (/id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(whereClause)) {
        const id = params[0];
        const userId = params[1];
        const index = table.findIndex(r => r.id === id && r.user_id === userId);
        if (index === -1) {
          return { rows: [], rowCount: 0 };
        }
        const removed = table.splice(index, 1);
        return { rows: removed, rowCount: 1 };
      }

      // DELETE by user_id only (Sovereign purge): WHERE user_id = $1
      if (/user_id\s*=\s*\$1/i.test(whereClause)) {
        const userId = params[0];
        const initialLen = table.length;
        const kept = table.filter(r => r.user_id !== userId);
        this.tables.set(tableName, kept);
        const removedCount = initialLen - kept.length;
        return { rows: [], rowCount: removedCount };
      }

      // DELETE by id: WHERE id = $1
      if (/id\s*=\s*\$1/i.test(whereClause)) {
        const id = params[0];
        const index = table.findIndex(r => r.id === id);
        if (index === -1) {
          return { rows: [], rowCount: 0 };
        }
        const removed = table.splice(index, 1);
        return { rows: removed, rowCount: 1 };
      }
    }

    return { rows: [], rowCount: 0 };
  }
}

/**
 * Returns active database pool or initializes in-memory database fallback
 */
export function getOrCreateDatabasePool(): Queryable {
  try {
    return getDatabasePool();
  } catch {
    const memoryDb = new InMemoryDatabase();
    setDatabasePool(memoryDb);
    return memoryDb;
  }
}
