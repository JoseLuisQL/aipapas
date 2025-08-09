import type { DB } from '../db/sqlite';
import { enqueue } from '../services/sync/queue';

export async function listIdentifications(db: DB) {
  return db.getAllAsync(`SELECT * FROM identifications ORDER BY timestamp DESC`);
}

export async function addIdentification(db: DB, ident: any) {
  await db.runAsync(
    `INSERT INTO identifications (id, image_path, result, confidence, location, timestamp, synced) VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [ident.id, ident.image_path, ident.result, ident.confidence, ident.location ?? '', ident.timestamp]
  );
  await enqueue(db, { operation_type: 'CREATE', table_name: 'identifications', data: ident, status: 'pending' });
}

export async function markIdentificationSynced(db: DB, id: string) {
  await db.runAsync(`UPDATE identifications SET synced = 1 WHERE id = ?`, [id]);
}

