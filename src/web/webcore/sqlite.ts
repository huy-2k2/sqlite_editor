import initSqlJs from 'sql.js';
import { TableInfo } from "../webcore/types/TableInfo";
import { TableColumn, TableColumnInfo } from './types/TableColumn';


export class SqliteUtil {
  private static Sql: any
  private static Database: any

  static async create(locatefile: any, bytes: Uint8Array<any>): Promise<void> {

    if(!SqliteUtil.Sql) {
      SqliteUtil.Sql =  await initSqlJs({
        locateFile: () => locatefile!,
      })


    }
    SqliteUtil.Database =  new SqliteUtil.Sql.Database(bytes);
  }

  static disposeObject(): void {
    SqliteUtil.Database = null;
    SqliteUtil.Sql = null;
  }


  static getTableSchema(tableName: string): TableColumn[] {
    const res = SqliteUtil.queryDatabase(`PRAGMA table_info(${tableName});`);

    if (res.length === 0) return [];

    const rows = res[0].values as TableColumnInfo[];

    return rows.map((row: TableColumnInfo) => ({
      cid: row[0],
      name: row[1],
      type: row[2],
      notNull: row[3] === 1,
      defaultValue: row[4],
      primaryKey: row[5] === 1,
    }));
  }

  static getDatabaseNames(): TableInfo[] {
    let query = `
        SELECT name
        FROM sqlite_master
        WHERE type='table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
      `
      let result = SqliteUtil.queryDatabase(query);


      if (result.length > 0) {
        const rows = result[0].values as string[][];
        return rows.map((r) => ({ name: r[0] }))
      } else {
        return []
      }


  }

  static queryDatabase(sql: string): any {

    if (!SqliteUtil.Database) return [];
    return SqliteUtil.Database.exec(sql);
  }


  
}
