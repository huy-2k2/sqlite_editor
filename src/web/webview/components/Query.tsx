import React, { useEffect, useState, useRef } from "react";
import { TableColumns } from "./SqliteEditor";
import { randomId } from "@mui/x-data-grid-generator";
import SqlEditor, { SqliteEditorHandle } from "./SqliteEditor";
import { SqliteUtil } from "../../webcore/sqlite";

import { UnknowQueryResult } from "../../webcore/types/UnknowQueryResult";

interface QueryProps {
  queryText: string;
  setQueryText(newText: string): void;
}

const Query: React.FC<QueryProps> = ({ queryText, setQueryText }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<TableColumns>({});

  const editorRef = useRef<SqliteEditorHandle>(null);

  useEffect(() => {
    let tableInfos = SqliteUtil.getTableNames();

    let tableNames = tableInfos.map((t) => t.name);

    let tableSchemas: TableColumns = {};
    tableNames.forEach((tbn) => {
      const cls = SqliteUtil.getTableSchema(tbn);
      tableSchemas[tbn] = cls.map((c) => c.name);
    });

    setTables(tableNames);
    setTableColumns(tableSchemas);
  }, []);

  function isEmptyText(text: string | null | undefined): boolean {
    return !text || text.trim().length === 0;
  }

  const getSelectedText = () => {
    const text = editorRef.current?.getSelectedText();
    return text;
  };

  function handleRunQuery(): void {
    const querySelected = getSelectedText();

    const runQuery = isEmptyText(querySelected) ? queryText : querySelected;

    if (!runQuery || isEmptyText(runQuery)) {
      return;
    }

    const unknowQueryResult = SqliteUtil.executeUnKnowSql(runQuery);

    console.log(runQuery);

    console.log(unknowQueryResult);
  }

  return (
    <div style={styles.container}>
      <div>
        {tables.length > 0 && (
          <SqlEditor
            ref={editorRef}
            tables={tables}
            tableColumns={tableColumns}
            defaultText={queryText}
            setDefaultText={setQueryText}
          ></SqlEditor>
        )}
      </div>
      <div style={styles.buttonwraper}>
        <button onClick={handleRunQuery} style={styles.buttonrun}>
          Run query
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
  },

  buttonwraper: {
    position: "absolute",
    top: "-40px",
    right: "4px",
  },

  buttonrun: {
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
  },
};

export default Query;
