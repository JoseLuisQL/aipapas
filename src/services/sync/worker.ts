import NetInfo from '@react-native-community/netinfo';
import type { DB } from '../../db/sqlite';
import { getPending, markAsError, markAsSynced } from './queue';

export async function runSync(db: DB) {
  const net = await NetInfo.fetch();
  if (!net.isConnected) return;

  const pending = await getPending(db);
  for (const item of pending) {
    try {
      // Simula envío a backend con delay
      await new Promise((res) => setTimeout(res, 300));
      await markAsSynced(db, item.id);
    } catch (e) {
      await markAsError(db, item.id);
    }
  }
}

