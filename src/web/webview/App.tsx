import React from "react";
import { useEffect, useState } from "react";
import initSqlJs from "sql.js";

type TableInfo = {
  name: string;
};

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

      const SQL = await initSqlJs({
        locateFile: () => wasmUri!,
      });

      // 3️⃣ load db
      const database = new SQL.Database(bytes);

      // 4️⃣ query tables
      const result = database.exec(`
        SELECT name
        FROM sqlite_master
        WHERE type='table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
      `);

      if (result.length > 0) {
        const rows = result[0].values as string[][];
        setTables(rows.map((r) => ({ name: r[0] })));
      } else {
        setTables([]);
      }
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
