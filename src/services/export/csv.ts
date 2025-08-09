import * as FileSystem from 'expo-file-system';

export async function exportToCSV(filename: string, rows: any[]) {
  const header = Object.keys(rows[0] ?? {}).join(',');
  const body = rows.map((r) => Object.values(r).map(v => JSON.stringify(v)).join(',')).join('\n');
  const content = [header, body].filter(Boolean).join('\n');
  const path = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 });
  return path;
}

