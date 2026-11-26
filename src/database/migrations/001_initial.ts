import type { Migration } from './index';

export const migration001: Migration = {
  version: 1,
  name: 'initial_schema',
  statements: [
    `CREATE TABLE categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,

    `CREATE TABLE receipts (
      id TEXT PRIMARY KEY NOT NULL,
      merchant_name TEXT,
      receipt_date TEXT NOT NULL,
      amount REAL,
      category_id TEXT NOT NULL REFERENCES categories(id),
      tax_year INTEGER NOT NULL,
      notes TEXT,
      local_image_path TEXT NOT NULL,
      drive_file_id TEXT,
      drive_file_name TEXT,
      drive_folder_id TEXT,
      drive_web_view_link TEXT,
      upload_status TEXT NOT NULL DEFAULT 'draft'
        CHECK (upload_status IN ('draft','pending','uploading','completed','failed')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    )`,
    `CREATE INDEX idx_receipts_tax_year ON receipts(tax_year)`,
    `CREATE INDEX idx_receipts_category ON receipts(category_id)`,
    `CREATE INDEX idx_receipts_status ON receipts(upload_status)`,
    `CREATE INDEX idx_receipts_date ON receipts(receipt_date)`,

    `CREATE TABLE drive_folders (
      id TEXT PRIMARY KEY NOT NULL,
      folder_name TEXT NOT NULL,
      folder_type TEXT NOT NULL CHECK (folder_type IN ('root','year','category')),
      parent_folder_id TEXT,
      drive_folder_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      UNIQUE (folder_type, folder_name, parent_folder_id)
    )`,

    // UNIQUE(receipt_id) guarantees at most one upload job per receipt.
    `CREATE TABLE upload_queue (
      id TEXT PRIMARY KEY NOT NULL,
      receipt_id TEXT NOT NULL UNIQUE REFERENCES receipts(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('draft','pending','uploading','completed','failed')),
      retry_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE INDEX idx_upload_queue_status ON upload_queue(status)`,
  ],
};
