import { openDB, migrate } from './sqlite';
import { seed } from './seed';

export async function prepareDatabase() {
  const db = await openDB();
  await migrate(db);
  await seed(db);
  return db;
}

