import { query, queryOne, run } from '../client';
import { nowISO } from '../../utils/date';
import { uuid } from '../../utils/uuid';
import type { DriveFolder, DriveFolderType } from '../../types';

interface DriveFolderRow {
  id: string;
  folder_name: string;
  folder_type: DriveFolderType;
  parent_folder_id: string | null;
  drive_folder_id: string;
  created_at: string;
}

const toFolder = (r: DriveFolderRow): DriveFolder => ({
  id: r.id,
  folderName: r.folder_name,
  folderType: r.folder_type,
  parentFolderId: r.parent_folder_id,
  driveFolderId: r.drive_folder_id,
  createdAt: r.created_at,
});

/** Local cache of Drive folder IDs so we never re-search Drive for known folders. */
export const DriveFolderRepository = {
  async find(
    type: DriveFolderType,
    name: string,
    parentDriveFolderId: string | null,
  ): Promise<DriveFolder | null> {
    const row = await queryOne<DriveFolderRow>(
      `SELECT * FROM drive_folders
        WHERE folder_type = ? AND folder_name = ?
          AND ${parentDriveFolderId == null ? 'parent_folder_id IS NULL' : 'parent_folder_id = ?'}`,
      parentDriveFolderId == null ? [type, name] : [type, name, parentDriveFolderId],
    );
    return row ? toFolder(row) : null;
  },

  async insert(
    type: DriveFolderType,
    name: string,
    parentDriveFolderId: string | null,
    driveFolderId: string,
  ): Promise<void> {
    await run(
      `INSERT OR IGNORE INTO drive_folders
        (id, folder_name, folder_type, parent_folder_id, drive_folder_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuid(), name, type, parentDriveFolderId, driveFolderId, nowISO()],
    );
  },

  async getAll(): Promise<DriveFolder[]> {
    const rows = await query<DriveFolderRow>('SELECT * FROM drive_folders ORDER BY created_at');
    return rows.map(toFolder);
  },

  /** Clears the local cache only. Never touches anything in Google Drive. */
  async clearCache(): Promise<void> {
    await run('DELETE FROM drive_folders');
  },
};
