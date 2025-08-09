import type { DB } from '../../db/sqlite';

export type QueueItem = {
  id?: number;
  operation_type: 'CREATE' | 'UPDATE' | 'DELETE';
  table_name: string;
  data: Record<string, any>;
  status: 'pending' | 'synced' | 'error';
};

export async function enqueue(db: DB, item: Omit<QueueItem, 'id'>) {
  await db.runAsync(
    `INSERT INTO sync_queue (operation_type, table_name, data, status) VALUES (?, ?, ?, ?)`,
    [item.operation_type, item.table_name, JSON.stringify(item.data), item.status]
  );
}

export async function getPending(db: DB) {
  return db.getAllAsync(`SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY id ASC`);
}

export async function markAsSynced(db: DB, id: number) {
  await db.runAsync(`UPDATE sync_queue SET status = 'synced' WHERE id = ?`, [id]);
}

export async function markAsError(db: DB, id: number) {
  await db.runAsync(`UPDATE sync_queue SET status = 'error' WHERE id = ?`, [id]);
}

