import type { DB } from '../db/sqlite';
import { enqueue } from '../services/sync/queue';

export async function listFeedback(db: DB, { status }: { status?: string } = {}) {
  const where = status ? `WHERE status = ?` : '';
  const params = status ? [status] : [];
  return db.getAllAsync(`SELECT * FROM feedback ${where} ORDER BY created_at DESC`, params);
}

export async function updateFeedbackStatus(db: DB, id: string, status: string) {
  await db.runAsync(`UPDATE feedback SET status = ? WHERE id = ?`, [status, id]);
  await enqueue(db, { operation_type: 'UPDATE', table_name: 'feedback', data: { id, status }, status: 'pending' });
}

