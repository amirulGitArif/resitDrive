import { run } from './client';
import { nowISO } from '../utils/date';

/** Default categories. Stable string IDs so Drive folder mapping stays predictable. */
export const DEFAULT_CATEGORIES: { id: string; name: string; icon: string }[] = [
  { id: 'medical', name: 'Medical', icon: 'medical' },
  { id: 'education', name: 'Education', icon: 'education' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'lifestyle' },
  { id: 'sports', name: 'Sports & Exercise', icon: 'sports' },
  { id: 'insurance', name: 'Insurance', icon: 'insurance' },
  { id: 'childcare', name: 'Childcare', icon: 'childcare' },
  { id: 'books', name: 'Books', icon: 'books' },
  { id: 'other', name: 'Other', icon: 'other' },
];

export async function seedCategories(): Promise<void> {
  const now = nowISO();
  for (const c of DEFAULT_CATEGORIES) {
    // INSERT OR IGNORE keeps user edits to existing categories intact.
    await run(
      `INSERT OR IGNORE INTO categories (id, name, icon, is_active, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)`,
      [c.id, c.name, c.icon, now, now],
    );
  }
}
