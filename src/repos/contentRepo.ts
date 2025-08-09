import type { DB } from '../db/sqlite';
import { enqueue } from '../services/sync/queue';

export async function listContent(db: DB, { search = '' }: { search?: string } = {}) {
  const where: string[] = [];
  const params: any[] = [];
  if (search) { where.push('(title LIKE ? OR body LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.getAllAsync(`SELECT * FROM content ${whereSql} ORDER BY title ASC`, params);
}

export async function createContent(db: DB, c: any) {
  await db.runAsync(
    `INSERT INTO content (id, title, body, category, media, status, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [c.id, c.title, c.body, c.category ?? '', JSON.stringify(c.media ?? []), c.status ?? 'draft', c.scheduled_at ?? null]
  );
  await enqueue(db, { operation_type: 'CREATE', table_name: 'content', data: c, status: 'pending' });
}

export async function updateContent(db: DB, c: any) {
  await db.runAsync(
    `UPDATE content SET title = ?, body = ?, category = ?, media = ?, status = ?, scheduled_at = ? WHERE id = ?`,
    [c.title, c.body, c.category ?? '', JSON.stringify(c.media ?? []), c.status ?? 'draft', c.scheduled_at ?? null, c.id]
  );
  await enqueue(db, { operation_type: 'UPDATE', table_name: 'content', data: c, status: 'pending' });
}

export async function deleteContent(db: DB, id: string) {
  await db.runAsync(`DELETE FROM content WHERE id = ?`, [id]);
  await enqueue(db, { operation_type: 'DELETE', table_name: 'content', data: { id }, status: 'pending' });
}

