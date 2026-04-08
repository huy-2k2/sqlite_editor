import React, { useEffect, useState, useRef, use } from "react";
import { TableColumns } from "./SqliteEditor";
import { randomId } from "@mui/x-data-grid-generator";
import SqlEditor, { SqliteEditorHandle } from "./SqliteEditor";
import { SqliteUtil } from "../../webcore/sqlite";

import { UnknowQueryResult } from "../../webcore/types/UnknowQueryResult";
import SqlResultViewer from "./SqlResultViewer";

interface QueryProps {
  queryText: string;
  setQueryText(newText: string): void;
  queryResult: UnknowQueryResult[];
  setQueryResult(queryResult: UnknowQueryResult[]): void;
}

const Query: React.FC<QueryProps> = ({
  queryText,
  setQueryText,
  queryResult,
  setQueryResult,
}) => {
  const [tables, setTables] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<TableColumns>({});

  const [isShowingResult, setIsShowingResult] = useState<boolean>(false);

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
    

    // test
    try {
      fetch("https://nqhuy.info/sqliteapi/api/tags");

    } catch(e) {
      console.log(e)
    }
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
    console.log(unknowQueryResult);
    setQueryResult(unknowQueryResult);

    setIsShowingResult(true);
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
        <button
          style={styles.buttonrun}
          onClick={() => setIsShowingResult((b) => !b)}
        >
          {isShowingResult ? "Hiden result" : "Show result"}
        </button>
        <button onClick={handleRunQuery} style={styles.buttonrun}>
          Run query
        </button>
      </div>
      {isShowingResult && (
        <div style={styles.resultcontainer}>
          <SqlResultViewer results={queryResult}></SqlResultViewer>
        </div>
      )}
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
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
  },

  buttonrun: {
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
  },

  resultcontainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTop: "1px solid #ccc",
    height: "calc(100vh - 210px)",
    color: "#fff",
  },
};

export default Query;
