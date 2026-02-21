import initSqlJs from 'sql.js';
import { TableInfo } from "../webcore/types/TableInfo";
import { TableColumn, TableColumnInfo } from './types/TableColumn';
import {TableRaws} from './types/TableRaws'
import { SqlUpdateResult } from './types/SqlUpdateResult';


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

  static getFullRows(tableName: string): TableRaws {
    let query = `
      select * from ${tableName};
    `
    let result: TableRaws[] = SqliteUtil.queryDatabase(query);
    
    if(result?.length) {
      return result[0]
    }

    return {
      values: [],
      lc: []
    }
  }

  static updateOneRowByEntireEntity(tableName: string, newentity: any, oldentity: any): SqlUpdateResult {

    newentity = JSON.parse(JSON.stringify(newentity));
    oldentity = JSON.parse(JSON.stringify(oldentity));


    const tableSchema = SqliteUtil.getTableSchema(tableName);
   
    Object.keys(newentity).forEach(k => {
      if(tableSchema.findIndex(tc => {
        return tc.name == k
      }) == -1) {
        delete newentity[k]
      }
    })

    Object.keys(oldentity).forEach(k => {
      if(tableSchema.findIndex(tc => {
        return tc.name == k
      }) == -1) {
        delete oldentity[k]
      }
    })

    let query = `
      UPDATE ${tableName} 
      SET ${SqliteUtil.buildSetClauseByEntity(newentity)}
      WHERE
    `;
      query+= ` ${SqliteUtil.buildWhereClauseByEntity(oldentity)}`



    const queryrs = SqliteUtil.queryDatabaseWithThrowError(query)
    
    return {
      isSuccess: queryrs.success,
      errorMessage: queryrs.error
    }
  }

  private static queryDatabase(sql: string): any {

    if (!SqliteUtil.Database) return [];
    return SqliteUtil.Database.exec(sql);
  }


  private static queryDatabaseWithThrowError(sql: string) {
  try {
    console.log("run query", sql)
    SqliteUtil.Database.run(sql);
    return {
      success: true,
      error: "",
    };
  } catch (e: any) {
    console.log(e)
    return {
      success: false,
      error: e?.message ?? String(e),
    };
  }
}

  private static sqlValue(val: any): string {
    if (val === null || val === undefined) return "NULL";

    if (typeof val === "number" || typeof val === "boolean") {
      return String(val);
    }

    // string / date / uuid ...
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  private static buildSetClauseByEntity(entity: any): string {
    if (!entity || typeof entity !== "object") {
      throw new Error("entity must be an object");
    }

    const keys = Object.keys(entity);
    if (keys.length === 0) {
      throw new Error("entity is empty");
    }

    return keys
      .map(key => `"${key}" = ${SqliteUtil.sqlValue(entity[key])}`)
      .join(", ");
  }

  private static buildWhereClauseByEntity(oldEntity: any): string {
    if (!oldEntity || typeof oldEntity !== "object") {
      throw new Error("oldEntity must be an object");
    }

    const keys = Object.keys(oldEntity);
    if (keys.length === 0) {
      throw new Error("WHERE condition is empty");
    }

    return keys
      .map(key => `"${key}" = ${SqliteUtil.sqlValue(oldEntity[key])}`)
      .join(" AND ");
  }
}
