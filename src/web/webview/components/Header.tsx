import React from "react";
import { SqliteUtil } from "../../webcore/sqlite";

interface HeaderProps {
  databaseName: string;
}

const SQLiteHeader: React.FC<HeaderProps> = ({ databaseName }) => {

  function handleExportDb() {
    let blobDb = SqliteUtil.exportDatabase();
    const url = URL.createObjectURL(blobDb);

    const a = document.createElement("a");
    a.href = url;
    a.download = databaseName; // tên file export
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Title and Status Section */}
        <div style={styles.topSection}>
          <h1 style={styles.title}>SQLite Editor</h1>

          <div style={styles.statusBadge}>
            <span style={styles.statusDot}></span>
            <span style={styles.statusText}>CONNECTED</span>
          </div>
           <div style={styles.buttonExport} onClick={handleExportDb}>Export Database</div>
        </div>

        {/* Database Path Section */}
        <div style={styles.dbwraper}>
          <div style={styles.databasePath}>{databaseName}</div>
         
        </div>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  buttonExport: {
    backgroundColor: "#22c55e",
    border: 'none',
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    position: "absolute",
    fontSize: "14px",
    right: "12px",
    padding: "4px 8px",
    top: "15px",

  },
  dbwraper: {
    display: "flex",
    alignItems: "center",
    columnGap: "20px"
  },
  header: {
    backgroundColor: "#2b2b2b",
    padding: "8px 24px",
    borderBottom: "1px solid #3a3a3a",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  topSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    position: "relative"
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#22c55e",
    padding: "6px 14px",
    borderRadius: "16px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  iconButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  icon: {
    fontSize: "16px",
    color: "#a0a0a0",
  },
  databasePath: {
    fontSize: "13px",
    color: "#a0a0a0",
    fontFamily: "monospace",
  },
};

export default SQLiteHeader;
