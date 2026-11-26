import { query, queryOne, run } from '../client';
import { nowISO } from '../../utils/date';
import { uuid } from '../../utils/uuid';
import type { UploadQueueItem, UploadStatus } from '../../types';

interface QueueRow {
  id: string;
  receipt_id: string;
  status: UploadStatus;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

const toItem = (r: QueueRow): UploadQueueItem => ({
  id: r.id,
  receiptId: r.receipt_id,
  status: r.status,
  retryCount: Number(r.retry_count),
  lastError: r.last_error,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const UploadQueueRepository = {
  /** No-op if the receipt already has a job (UNIQUE receipt_id prevents duplicates). */
  async enqueue(receiptId: string): Promise<void> {
    const now = nowISO();
    await run(
      `INSERT OR IGNORE INTO upload_queue
        (id, receipt_id, status, retry_count, created_at, updated_at)
       VALUES (?, ?, 'pending', 0, ?, ?)`,
      [uuid(), receiptId, now, now],
    );
  },

  async getByReceiptId(receiptId: string): Promise<UploadQueueItem | null> {
    const row = await queryOne<QueueRow>('SELECT * FROM upload_queue WHERE receipt_id = ?', [
      receiptId,
    ]);
    return row ? toItem(row) : null;
  },

  async getRunnable(): Promise<UploadQueueItem[]> {
    const rows = await query<QueueRow>(
      "SELECT * FROM upload_queue WHERE status IN ('pending','failed') ORDER BY created_at",
    );
    return rows.map(toItem);
  },

  async setStatus(id: string, status: UploadStatus, lastError: string | null = null): Promise<void> {
    await run('UPDATE upload_queue SET status = ?, last_error = ?, updated_at = ? WHERE id = ?', [
      status,
      lastError,
      nowISO(),
      id,
    ]);
  },

  async incrementRetry(id: string): Promise<void> {
    await run(
      'UPDATE upload_queue SET retry_count = retry_count + 1, updated_at = ? WHERE id = ?',
      [nowISO(), id],
    );
  },
};
