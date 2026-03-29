export type UnknowQueryResult =
| {
      type: "select";
      columns: string[];
      rows: any[][];
      statement: string;
    }
  | {
      type: "change";
      rowsAffected: number;
      statement: string;
    }
  | {
      type: "error";
      message: string;
      statement: string;
    };