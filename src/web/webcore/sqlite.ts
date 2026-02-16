import initSqlJs from 'sql.js';
import { TableInfo } from "../webcore/types/TableInfo";

let Sql: any

export class SqliteUtil {
  Database: any
  private constructor(bytes: Uint8Array<any>) {
    this.Database = new Sql.Database(bytes);
  }


  static async create(locatefile: any, bytes: Uint8Array<any>): Promise<SqliteUtil> {
    if(!Sql) {
      Sql =  await initSqlJs({
        locateFile: () => locatefile!,
      })
    }


    let sqlUtil = new SqliteUtil(bytes)

    return sqlUtil;
  }


  getDatabaseNames(): TableInfo[] {
    let query = `
        SELECT name
        FROM sqlite_master
        WHERE type='table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
      `
      let result = this.queryDatabase(query);


      if (result.length > 0) {
        const rows = result[0].values as string[][];
        return rows.map((r) => ({ name: r[0] }))
      } else {
        return []
      }


  }

  queryDatabase(sql: string): any {
    if (!this.Database) return [];
    return this.Database.exec(sql);
  }


  
}
