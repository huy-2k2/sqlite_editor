import React from "react";
import { useEffect, useState } from "react";

import { SqliteUtil } from "../webcore/sqlite";
import { TableInfo } from "../webcore/types/TableInfo";
import FullScreenLoading from "./components/FullScreenLoading";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RightPage from "./components/RightPage";
import "./styles/main.css";

import { ToastContainer } from "react-toastify";
const vscode = window.acquireVsCodeApi();

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbName, setDbName] = useState<string>("");
  const [tables, setTables] = useState<Array<TableInfo>>([]);
  const [activeTable, setActiveTable] = useState<string>();

  const handleTableSelect = (name: string) => setActiveTable(name);

  useEffect(() => {
    console.log("code web applyed");
    vscode.postMessage({
      type: "webview-ready",
    });

    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== "db-loaded") return;

      SqliteUtil.disposeObject();

      const { data, name } = event.data.payload;
      setDbName(name);

      // 1️⃣ convert bytes
      const bytes = new Uint8Array(data);
      // 2️⃣ init sql.js

      let wasmUri = event.data.payload.wasmUri;

      await SqliteUtil.create(wasmUri, bytes);

      setTables(SqliteUtil.getDatabaseNames());

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
      <ToastContainer />
      <FullScreenLoading isLoading={isLoading} />
      {!isLoading && (
        <div>
          <div className="header">
            <Header databaseName={dbName}></Header>
          </div>
          <div style={styles.container}>
            <div>
              <Sidebar
                tables={tables.map((i) => i.name)}
                activeTable={activeTable}
                onTableSelect={handleTableSelect}
              ></Sidebar>
            </div>
            <div>
              <RightPage
                activeTable={activeTable}
                onTableSelect={handleTableSelect}
                databaseName={dbName}
              ></RightPage>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    display: "flex",
  },
};
