import { query, queryOne, run, SqlParam } from '../client';
import { nowISO, taxYearFromDate } from '../../utils/date';
import { uuid } from '../../utils/uuid';
import type {
  NewReceiptInput,
  Receipt,
  ReceiptFilters,
  ReceiptStats,
  UploadStatus,
} from '../../types';

interface ReceiptRow {
  id: string;
  merchant_name: string | null;
  receipt_date: string;
  amount: number | null;
  category_id: string;
  category_name?: string;
  tax_year: number;
  notes: string | null;
  local_image_path: string;
  drive_file_id: string | null;
  drive_file_name: string | null;
  drive_folder_id: string | null;
  drive_web_view_link: string | null;
  upload_status: UploadStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const toReceipt = (r: ReceiptRow): Receipt => ({
  id: r.id,
  merchantName: r.merchant_name,
  receiptDate: r.receipt_date,
  amount: r.amount == null ? null : Number(r.amount),
  categoryId: r.category_id,
  categoryName: r.category_name,
  taxYear: Number(r.tax_year),
  notes: r.notes,
  localImagePath: r.local_image_path,
  driveFileId: r.drive_file_id,
  driveFileName: r.drive_file_name,
  driveFolderId: r.drive_folder_id,
  driveWebViewLink: r.drive_web_view_link,
  uploadStatus: r.upload_status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  deletedAt: r.deleted_at,
});

const SELECT_WITH_CATEGORY = `
  SELECT r.*, c.name AS category_name
    FROM receipts r
    JOIN categories c ON c.id = r.category_id`;

export const ReceiptRepository = {
  async create(input: NewReceiptInput): Promise<Receipt> {
    const id = uuid();
    const now = nowISO();
    await run(
      `INSERT INTO receipts
        (id, merchant_name, receipt_date, amount, category_id, tax_year, notes,
         local_image_path, upload_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
      [
        id,
        input.merchantName?.trim() || null,
        input.receiptDate,
        input.amount ?? null,
        input.categoryId,
        input.taxYear ?? taxYearFromDate(input.receiptDate),
        input.notes?.trim() || null,
        input.localImagePath,
        now,
        now,
      ],
    );
    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to read back created receipt');
    }
    return created;
  },

  async getById(id: string): Promise<Receipt | null> {
    const row = await queryOne<ReceiptRow>(
      `${SELECT_WITH_CATEGORY} WHERE r.id = ? AND r.deleted_at IS NULL`,
      [id],
    );
    return row ? toReceipt(row) : null;
  },

  async list(filters: ReceiptFilters = {}): Promise<Receipt[]> {
    const where: string[] = ['r.deleted_at IS NULL'];
    const params: SqlParam[] = [];

    const search = filters.search?.trim();
    if (search) {
      where.push('r.merchant_name LIKE ?');
      params.push(`%${search}%`);
    }
    if (filters.categoryId) {
      where.push('r.category_id = ?');
      params.push(filters.categoryId);
    }
    if (filters.taxYear != null) {
      where.push('r.tax_year = ?');
      params.push(filters.taxYear);
    }
    if (filters.dateFrom) {
      where.push('r.receipt_date >= ?');
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.push('r.receipt_date <= ?');
      params.push(filters.dateTo);
    }

    const limit = filters.limit ? ` LIMIT ${Math.floor(filters.limit)}` : '';
    const rows = await query<ReceiptRow>(
      `${SELECT_WITH_CATEGORY}
        WHERE ${where.join(' AND ')}
        ORDER BY r.receipt_date DESC, r.created_at DESC${limit}`,
      params,
    );
    return rows.map(toReceipt);
  },

  getRecent(limit = 5): Promise<Receipt[]> {
    return this.list({ limit });
  },

  /** Count/total are for the given tax year; pending/failed are across all years. */
  async getStats(taxYear: number): Promise<ReceiptStats> {
    const totals = await queryOne<{ total_count: number; total_amount: number }>(
      `SELECT COUNT(*) AS total_count, COALESCE(SUM(amount), 0) AS total_amount
         FROM receipts WHERE deleted_at IS NULL AND tax_year = ?`,
      [taxYear],
    );
    const sync = await queryOne<{ pending_count: number; failed_count: number }>(
      `SELECT
         COALESCE(SUM(CASE WHEN upload_status IN ('pending','uploading') THEN 1 ELSE 0 END), 0) AS pending_count,
         COALESCE(SUM(CASE WHEN upload_status = 'failed' THEN 1 ELSE 0 END), 0) AS failed_count
         FROM receipts WHERE deleted_at IS NULL`,
    );
    return {
      taxYear,
      totalCount: Number(totals?.total_count ?? 0),
      totalAmount: Number(totals?.total_amount ?? 0),
      pendingCount: Number(sync?.pending_count ?? 0),
      failedCount: Number(sync?.failed_count ?? 0),
    };
  },

  async updateUploadStatus(id: string, status: UploadStatus): Promise<void> {
    await run('UPDATE receipts SET upload_status = ?, updated_at = ? WHERE id = ?', [
      status,
      nowISO(),
      id,
    ]);
  },

  /** Soft delete (local record only). Cloud deletion is a separate, explicit action. */
  async softDelete(id: string): Promise<void> {
    const now = nowISO();
    await run('UPDATE receipts SET deleted_at = ?, updated_at = ? WHERE id = ?', [
      now,
      now,
      id,
    ]);
  },

  /** DEV ONLY: remove sample rows inserted by the Settings dev tools. */
  async hardDeleteSamples(): Promise<number> {
    const res = await run("DELETE FROM receipts WHERE local_image_path LIKE 'sample://%'");
    return res.rowsAffected;
  },
};
