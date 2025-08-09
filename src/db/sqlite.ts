import * as SQLite from 'expo-sqlite';

export type DB = SQLite.SQLiteDatabase;

export async function openDB() {
  const db = await SQLite.openDatabaseAsync('aipapas.db');
  return db;
}

export async function migrate(db: DB) {
  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    synced_at TEXT
  );
  CREATE TABLE IF NOT EXISTS varieties (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    characteristics TEXT,
    images TEXT
  );
  CREATE TABLE IF NOT EXISTS varieties_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    variety_id TEXT NOT NULL,
    snapshot TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS identifications (
    id TEXT PRIMARY KEY NOT NULL,
    image_path TEXT NOT NULL,
    result TEXT NOT NULL,
    confidence REAL,
    location TEXT,
    timestamp TEXT,
    synced INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation_type TEXT NOT NULL,
    table_name TEXT NOT NULL,
    data TEXT NOT NULL,
    status TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT,
    media JSON,
    status TEXT DEFAULT 'published',
    scheduled_at TEXT
  );
  CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT DEFAULT 'new'
  );
  `);
}

