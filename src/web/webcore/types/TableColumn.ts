export type TableColumnInfo = [
  number,        // cid
  string,        // name
  string,        // type
  number,        // notnull (0 | 1)
  string | null, // dflt_value
  number         // pk (0 | 1)
];


export interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notNull: boolean;
  defaultValue: string | null;
  primaryKey: boolean;
}
