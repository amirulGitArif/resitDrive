import { query } from '../client';
import type { Category, CategorySummary } from '../../types';

interface CategoryRow {
  id: string;
  name: string;
  icon: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CategorySummaryRow {
  id: string;
  name: string;
  icon: string | null;
  receipt_count: number;
  total_amount: number;
}

const toCategory = (r: CategoryRow): Category => ({
  id: r.id,
  name: r.name,
  icon: r.icon,
  isActive: r.is_active === 1,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const CategoryRepository = {
  async getAll(activeOnly = true): Promise<Category[]> {
    const rows = await query<CategoryRow>(
      `SELECT * FROM categories ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY rowid`,
    );
    return rows.map(toCategory);
  },

  /** Receipt count and total entered amount per category (excludes soft-deleted receipts). */
  async getSummaries(taxYear?: number): Promise<CategorySummary[]> {
    const yearClause = taxYear != null ? 'AND r.tax_year = ?' : '';
    const rows = await query<CategorySummaryRow>(
      `SELECT c.id, c.name, c.icon,
              COUNT(r.id) AS receipt_count,
              COALESCE(SUM(r.amount), 0) AS total_amount
         FROM categories c
         LEFT JOIN receipts r
           ON r.category_id = c.id AND r.deleted_at IS NULL ${yearClause}
        WHERE c.is_active = 1
        GROUP BY c.id
        ORDER BY c.rowid`,
      taxYear != null ? [taxYear] : [],
    );
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      receiptCount: Number(r.receipt_count),
      totalAmount: Number(r.total_amount),
    }));
  },
};
