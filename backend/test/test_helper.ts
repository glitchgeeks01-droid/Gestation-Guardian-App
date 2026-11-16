/**
 * Universal Test Helper & Assertion Framework
 * Compatible with both Jest and Node.js native test runner (node:test)
 * Scope: backend/test/
 */

import * as nodeTest from 'node:test';
import assert from 'node:assert/strict';

export const describe = (globalThis as any).describe || nodeTest.describe;
export const it = (globalThis as any).it || (globalThis as any).test || nodeTest.it;
export const test = it;
export const beforeEach = (globalThis as any).beforeEach || nodeTest.beforeEach;
export const afterEach = (globalThis as any).afterEach || nodeTest.afterEach;

/**
 * Universal Jest-compatible Expectation Matcher
 */
export function expect(actual: any) {
  if (typeof (globalThis as any).expect === 'function') {
    return (globalThis as any).expect(actual);
  }

  return {
    toBe(expected: any) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected: any) {
      assert.deepStrictEqual(actual, expected);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toBeFalsy() {
      assert.ok(!actual);
    },
    toBeNull() {
      assert.strictEqual(actual, null);
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined);
    },
    toBeUndefined() {
      assert.strictEqual(actual, undefined);
    },
    toContain(item: any) {
      if (typeof actual === 'string' || Array.isArray(actual)) {
        assert.ok(actual.includes(item), `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
      } else if (actual instanceof Set || actual instanceof Map) {
        assert.ok(actual.has(item), `Expected collection to contain ${item}`);
      } else {
        assert.ok(item in actual, `Expected property '${item}' in object`);
      }
    },
    toThrow(expectedError?: any) {
      assert.throws(() => {
        if (typeof actual === 'function') actual();
      }, expectedError);
    },
    rejects: {
      async toThrow(expectedError?: any) {
        await assert.rejects(async () => {
          if (typeof actual === 'function') await actual();
          else await actual;
        }, expectedError);
      }
    },
    toBeGreaterThan(num: number) {
      assert.ok(actual > num, `Expected ${actual} > ${num}`);
    },
    toBeGreaterThanOrEqual(num: number) {
      assert.ok(actual >= num, `Expected ${actual} >= ${num}`);
    },
    toBeLessThan(num: number) {
      assert.ok(actual < num, `Expected ${actual} < ${num}`);
    },
    toBeLessThanOrEqual(num: number) {
      assert.ok(actual <= num, `Expected ${actual} <= ${num}`);
    },
    toHaveLength(len: number) {
      assert.strictEqual(actual?.length, len);
    },
    toMatch(regex: RegExp) {
      assert.match(String(actual), regex);
    },
    not: {
      toBe(expected: any) {
        assert.notStrictEqual(actual, expected);
      },
      toEqual(expected: any) {
        assert.notDeepStrictEqual(actual, expected);
      },
      toContain(item: any) {
        if (typeof actual === 'string' || Array.isArray(actual)) {
          assert.ok(!actual.includes(item), `Expected ${JSON.stringify(actual)} NOT to contain ${JSON.stringify(item)}`);
        }
      },
      toThrow() {
        assert.doesNotThrow(() => {
          if (typeof actual === 'function') actual();
        });
      }
    }
  };
}

/**
 * Mock In-Memory Database Client implementing Queryable
 */
export class MockDatabaseClient {
  public queries: Array<{ sql: string; params: any[] }> = [];
  public tables: Map<string, Array<Record<string, any>>> = new Map();

  constructor() {
    this.reset();
  }

  reset() {
    this.queries = [];
    this.tables = new Map([
      ['users', []],
      ['consent_log', []],
      ['profiles', []],
      ['health_entries', []],
      ['appointments', []],
      ['documents', []],
      ['audit_log', []]
    ]);
  }

  async query(sql: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    this.queries.push({ sql, params });

    const trimmed = sql.trim();

    // Handle INSERT INTO audit_log
    if (/INSERT\s+INTO\s+audit_log/i.test(trimmed)) {
      const row = {
        id: 'audit-uuid-' + (this.tables.get('audit_log')!.length + 1),
        timestamp: params[0] || new Date().toISOString(),
        user_id: params[1],
        action: params[2],
        resource_type: params[3],
        resource_id: params[4],
        ip_address: params[5],
        status: params[6]
      };
      this.tables.get('audit_log')!.push(row);
      return { rows: [row], rowCount: 1 };
    }

    // Handle generic INSERT
    const insertMatch = trimmed.match(/INSERT\s+INTO\s+([a-zA-Z_]+)/i);
    if (insertMatch && /RETURNING/i.test(trimmed)) {
      const tableName = insertMatch[1];
      const table = this.tables.get(tableName) || [];
      const newRecord: Record<string, any> = {
        id: params[0] || `gen-id-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      table.push(newRecord);
      this.tables.set(tableName, table);
      return { rows: [newRecord], rowCount: 1 };
    }

    // Handle SELECT
    const selectMatch = trimmed.match(/SELECT\s+.*?\s+FROM\s+([a-zA-Z_]+)/i);
    if (selectMatch) {
      const tableName = selectMatch[1];
      const table = this.tables.get(tableName) || [];

      // Check if filtering by id and user_id: WHERE id = $1 AND user_id = $2
      const idUserMatch = /WHERE\s+id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(trimmed);
      if (idUserMatch && params.length >= 2) {
        const id = params[0];
        const userId = params[1];
        const match = table.find(r => r.id === id && r.user_id === userId);
        return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
      }

      // Check if filtering by user_id only: WHERE user_id = $1
      const userOnlyMatch = /WHERE\s+user_id\s*=\s*\$1/i.test(trimmed);
      if (userOnlyMatch && params.length >= 1) {
        const userId = params[0];
        const matches = table.filter(r => r.user_id === userId);
        return { rows: matches, rowCount: matches.length };
      }

      return { rows: table, rowCount: table.length };
    }

    // Handle UPDATE
    const updateMatch = trimmed.match(/UPDATE\s+([a-zA-Z_]+)/i);
    if (updateMatch) {
      const tableName = updateMatch[1];
      const table = this.tables.get(tableName) || [];
      return { rows: table.slice(0, 1), rowCount: 1 };
    }

    // Handle DELETE
    const deleteMatch = trimmed.match(/DELETE\s+FROM\s+([a-zA-Z_]+)/i);
    if (deleteMatch) {
      const tableName = deleteMatch[1];
      return { rows: [], rowCount: 1 };
    }

    return { rows: [], rowCount: 0 };
  }
}
