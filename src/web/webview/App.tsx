import React from "react";
import { useEffect, useState } from "react";
import initSqlJs from "sql.js";

import { SqliteUtil } from "../webcore/sqlite";
import { TableInfo } from "../webcore/types/TableInfo";

export default function App() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [dbName, setDbName] = useState<string>("");

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== "db-loaded") return;

      const { data, name } = event.data.payload;
      setDbName(name);

      // 1️⃣ convert bytes
      const bytes = new Uint8Array(data);
      // 2️⃣ init sql.js

      let wasmUri = event.data.payload.wasmUri;

      let sqliteUtil = await SqliteUtil.create(wasmUri, bytes);

      let tables = sqliteUtil.getDatabaseNames();
      setTables(tables);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h2>SQLite Viewer</h2>
      <p>
        <b>DB:</b> {dbName}
      </p>

      <h3>Tables</h3>

      {tables.length === 0 && <p>(No tables)</p>}

      <ul>
        {tables.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
