import type { DB } from '../db/sqlite';
import { enqueue } from '../services/sync/queue';

export async function listVarieties(db: DB, filters: any = {}) {
  const where: string[] = [];
  const params: any[] = [];
  if (filters.color) { where.push('json_extract(characteristics, "$\.color") = ?'); params.push(filters.color); }
  if (filters.forma) { where.push('json_extract(characteristics, "$\.forma") = ?'); params.push(filters.forma); }
  if (filters.origen) { where.push('json_extract(characteristics, "$\.origen") = ?'); params.push(filters.origen); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.getAllAsync(`SELECT * FROM varieties ${whereSql} ORDER BY name ASC`, params);
}

export async function createVariety(db: DB, variety: any) {
  await db.runAsync(
    `INSERT INTO varieties (id, name, description, characteristics, images) VALUES (?, ?, ?, ?, ?)`,
    [variety.id, variety.name, variety.description ?? '', JSON.stringify(variety.characteristics ?? {}), JSON.stringify(variety.images ?? [])]
  );
  await enqueue(db, { operation_type: 'CREATE', table_name: 'varieties', data: variety, status: 'pending' });
}

export async function updateVariety(db: DB, variety: any) {
  // versionado: guardar snapshot previo
  const prev = await db.getFirstAsync(`SELECT * FROM varieties WHERE id = ?`, [variety.id]);
  if (prev) {
    await db.runAsync(
      `INSERT INTO varieties_versions (variety_id, snapshot, created_at) VALUES (?, ?, ?)`,
      [variety.id, JSON.stringify(prev), new Date().toISOString()]
    );
  }
  await db.runAsync(
    `UPDATE varieties SET name = ?, description = ?, characteristics = ?, images = ? WHERE id = ?`,
    [variety.name, variety.description ?? '', JSON.stringify(variety.characteristics ?? {}), JSON.stringify(variety.images ?? []), variety.id]
  );
  await enqueue(db, { operation_type: 'UPDATE', table_name: 'varieties', data: variety, status: 'pending' });
}

export async function deleteVariety(db: DB, id: string) {
  await db.runAsync(`DELETE FROM varieties WHERE id = ?`, [id]);
  await enqueue(db, { operation_type: 'DELETE', table_name: 'varieties', data: { id }, status: 'pending' });
}

