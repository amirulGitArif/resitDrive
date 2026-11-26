export type UploadStatus =
  | 'draft'
  | 'pending'
  | 'uploading'
  | 'completed'
  | 'failed';

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  icon: string | null;
  receiptCount: number;
  totalAmount: number;
}

export interface Receipt {
  id: string;
  merchantName: string | null;
  receiptDate: string; // YYYY-MM-DD
  amount: number | null; // RM
  categoryId: string;
  categoryName?: string;
  taxYear: number;
  notes: string | null;
  localImagePath: string;
  driveFileId: string | null;
  driveFileName: string | null;
  driveFolderId: string | null;
  driveWebViewLink: string | null;
  uploadStatus: UploadStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NewReceiptInput {
  merchantName?: string | null;
  receiptDate: string;
  amount?: number | null;
  categoryId: string;
  taxYear?: number;
  notes?: string | null;
  localImagePath: string;
}

export interface ReceiptFilters {
  search?: string;
  categoryId?: string;
  taxYear?: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export interface ReceiptStats {
  taxYear: number;
  totalCount: number;
  totalAmount: number;
  pendingCount: number;
  failedCount: number;
}

export type DriveFolderType = 'root' | 'year' | 'category';

export interface DriveFolder {
  id: string;
  folderName: string;
  folderType: DriveFolderType;
  parentFolderId: string | null;
  driveFolderId: string;
  createdAt: string;
}

export interface UploadQueueItem {
  id: string;
  receiptId: string;
  status: UploadStatus;
  retryCount: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}
