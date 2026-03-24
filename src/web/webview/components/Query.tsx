import React, { useEffect, useState } from "react";
import {TableColumns} from "./SqliteEditor";
import {
  randomId,
} from "@mui/x-data-grid-generator";
import SqlEditor from "./SqliteEditor";
import { SqliteUtil } from "../../webcore/sqlite";


interface QueryProps {
  queryText: string, 
  setQueryText(newText: string): void;
}

const Query: React.FC<QueryProps> = ({queryText, setQueryText}) => {


  const [tables, setTables] = useState<string[]>([])
  const [tableColumns, setTableColumns] = useState<TableColumns>({})

  useEffect(() => {
     let tableInfos = SqliteUtil.getTableNames();
    
        let tableNames = tableInfos.map(t => t.name);
    
        let tableSchemas: TableColumns = {};
        tableNames.forEach((tbn) => {
          const cls = SqliteUtil.getTableSchema(tbn);
          tableSchemas[tbn] = cls.map(c => c.name);
        })
    
        setTables(tableNames)
        setTableColumns(tableSchemas);
  }, [])


  

  return <div>
    <div >
      {
        tables.length > 0 &&
        <SqlEditor
        tables={tables}
        tableColumns={tableColumns}
        defaultText={queryText}
        setDefaultText={setQueryText}
        ></SqlEditor>
      }
    </div>
  </div>;
};

const styles: { [key: string]: React.CSSProperties } = {
  
};

export default Query;
