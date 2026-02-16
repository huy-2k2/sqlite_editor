import initSqlJs from 'sql.js';
import { TableInfo } from "../webcore/types/TableInfo";


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
