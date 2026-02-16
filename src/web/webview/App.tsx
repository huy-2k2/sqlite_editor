import React from "react";
import { useEffect, useState } from "react";

import { SqliteUtil } from "../webcore/sqlite";
import { TableInfo } from "../webcore/types/TableInfo";
import FullScreenLoading from "./components/FullScreenLoading";
import Header from "./components/Header";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

      setIsLoading(false);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div>
      <FullScreenLoading isLoading={isLoading} />
      {!isLoading && (
        <div>
          <div className="header">
            <Header databaseName={dbName}></Header>
          </div>
        </div>
      )}
    </div>
  );
}
