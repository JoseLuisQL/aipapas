import type { DB } from '../db/sqlite';
import { enqueue } from '../services/sync/queue';

export async function listUsers(db: DB, { search = '', role }: { search?: string; role?: string }) {
  const where: string[] = [];
  const params: any[] = [];
  if (search) {
    where.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (role) {
    where.push('role = ?');
    params.push(role);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.getAllAsync(`SELECT * FROM users ${whereSql} ORDER BY name ASC`, params);
}

export async function createUser(db: DB, user: any) {
  await db.runAsync(
    `INSERT INTO users (id, name, email, role, synced_at) VALUES (?, ?, ?, ?, NULL)`,
    [user.id, user.name, user.email, user.role]
  );
  await enqueue(db, { operation_type: 'CREATE', table_name: 'users', data: user, status: 'pending' });
}

export async function updateUser(db: DB, user: any) {
  await db.runAsync(
    `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
    [user.name, user.email, user.role, user.id]
  );
  await enqueue(db, { operation_type: 'UPDATE', table_name: 'users', data: user, status: 'pending' });
}

export async function softDeleteUser(db: DB, id: string) {
  // Soft delete simulado: marcamos synced_at con 'deleted'
  await db.runAsync(`UPDATE users SET synced_at = 'deleted' WHERE id = ?`, [id]);
  await enqueue(db, { operation_type: 'DELETE', table_name: 'users', data: { id }, status: 'pending' });
}

