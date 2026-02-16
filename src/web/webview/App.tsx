import React from "react";
import { useEffect, useState } from "react";

import { SqliteUtil } from "../webcore/sqlite";
import { TableInfo } from "../webcore/types/TableInfo";
import FullScreenLoading from "./components/FullScreenLoading";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./styles/main.css";
export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbName, setDbName] = useState<string>("");
  const [tables, setTables] = useState<Array<TableInfo>>([]);
  const [activeTable, setActiveTable] = useState<string>();

  const handleTableSelect = (name: string) => setActiveTable(name);

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

      setTables(sqliteUtil.getDatabaseNames());

      console.log("tables length", tables.length);

      setIsLoading(false);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (tables.length > 0) {
      setActiveTable(tables[0].name);
    }
  }, [tables]);

  return (
    <div>
      <FullScreenLoading isLoading={isLoading} />
      {!isLoading && (
        <div>
          <div className="header">
            <Header databaseName={dbName}></Header>
          </div>
          <div>
            <div>
              <Sidebar
                tables={tables.map((i) => i.name)}
                activeTable={activeTable}
                onTableSelect={handleTableSelect}
              ></Sidebar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
