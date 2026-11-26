import { runMigrations } from './migrations';
import { seedCategories } from './seed';

let initPromise: Promise<void> | null = null;

/** Idempotent: safe to call repeatedly (e.g. Splash retry). */
export function initializeDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await runMigrations();
      await seedCategories();
    })().catch(e => {
      initPromise = null; // allow retry after failure
      throw e;
    });
  }
  return initPromise;
}
