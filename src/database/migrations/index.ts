import { query, run, withTransaction } from '../client';
import { nowISO } from '../../utils/date';
import { migration001 } from './001_initial';

export interface Migration {
  version: number;
  name: string;
  statements: string[];
}

/** Append new migrations here. Never edit one that has shipped. */
export const MIGRATIONS: Migration[] = [migration001];

export async function runMigrations(): Promise<void> {
  await run('PRAGMA foreign_keys = ON');
  await run(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    )`,
  );

  const applied = await query<{ version: number }>(
    'SELECT version FROM schema_migrations',
  );
  const appliedVersions = new Set(applied.map(r => Number(r.version)));

  const pending = MIGRATIONS.filter(m => !appliedVersions.has(m.version)).sort(
    (a, b) => a.version - b.version,
  );

  for (const migration of pending) {
    await withTransaction(async () => {
      for (const statement of migration.statements) {
        await run(statement);
      }
      await run(
        'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
        [migration.version, migration.name, nowISO()],
      );
    });
  }
}

export async function getSchemaVersion(): Promise<number> {
  const rows = await query<{ v: number | null }>(
    'SELECT MAX(version) AS v FROM schema_migrations',
  );
  return rows.length > 0 && rows[0].v != null ? Number(rows[0].v) : 0;
}
