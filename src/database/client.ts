/**
 * Thin adapter around the SQLite library. This is the ONLY file that imports
 * the native SQLite package, so swapping libraries later is a one-file change.
 *
 * Library: @op-engineering/op-sqlite
 * NOTE: verify `open` / `execute` signatures against the installed version's
 * docs (see docs/PHASE1_TEST.md, step "Verify SQLite adapter").
 */
import { open } from '@op-engineering/op-sqlite';
import { DB_NAME } from '../app/config/constants';

export type SqlParam = string | number | null;

let db: ReturnType<typeof open> | null = null;

function getDb() {
  if (!db) {
    db = open({ name: DB_NAME });
  }
  return db;
}

export async function query<T>(sql: string, params: SqlParam[] = []): Promise<T[]> {
  const res = await getDb().execute(sql, params);
  // Newer versions return `rows` as an array; older ones used `rows._array`.
  const rows: any = (res as any).rows;
  if (Array.isArray(rows)) {
    return rows as T[];
  }
  if (rows && Array.isArray(rows._array)) {
    return rows._array as T[];
  }
  return [];
}

export async function queryOne<T>(sql: string, params: SqlParam[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function run(
  sql: string,
  params: SqlParam[] = [],
): Promise<{ rowsAffected: number }> {
  const res = await getDb().execute(sql, params);
  return { rowsAffected: Number((res as any).rowsAffected ?? 0) };
}

/** Runs fn between BEGIN/COMMIT; rolls back on error. Not re-entrant. */
export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  await run('BEGIN');
  try {
    const result = await fn();
    await run('COMMIT');
    return result;
  } catch (e) {
    try {
      await run('ROLLBACK');
    } catch {
      // ignore rollback failure; surface original error
    }
    throw e;
  }
}
