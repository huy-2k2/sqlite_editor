import initSqlJs from 'sql.js';

let SQL: any;
let db: any;

export async function openDb(buffer: Uint8Array) {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: f => f
    });
  }
  db = new SQL.Database(buffer);
}

export function query(sql: string) {
  if (!db) return [];
  return db.exec(sql);
}
