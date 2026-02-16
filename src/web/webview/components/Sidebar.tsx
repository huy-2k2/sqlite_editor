import React from "react";

interface SidebarProps {
  tables: string[];
  activeTable: string | undefined;
  onTableSelect: (name: string) => void;
  dbName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  tables,
  activeTable,
  onTableSelect,
  dbName,
}) => (
  <aside style={styles.container}>
    <div style={styles.innerScroll} className="sidebar-scroll">
      <div style={styles.headerRow}>
        <span style={styles.headerTitle}>Database</span>
      </div>
      {dbName && (
        <div style={styles.dbNameWrapper}>
          <span style={styles.dbName} title={dbName}>
            {dbName}
          </span>
        </div>
      )}
      <div style={styles.sectionTitle}>Tables</div>
      <div style={styles.listWrapper}>
        {tables.map((name) => (
          <div
            key={name}
            style={{
              ...styles.tableItem,
              ...(activeTable === name ? styles.activeItem : {}),
            }}
            onClick={() => onTableSelect(name)}
            tabIndex={0}
            role="button"
            aria-pressed={activeTable === name}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
    {/* Thanh cuộn ngang nếu dbname dài */}
    <div style={styles.horizontalScrollBar}>&nbsp;</div>
  </aside>
);

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    width: 280,
    background: "#232323",
    color: "#fff",
    height: "calc(100vh - 71px)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #303030",
    overflow: "hidden",
    position: "relative",
  },
  innerScroll: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    overflowX: "auto",
  },
  horizontalScrollBar: {
    height: 12,
    minHeight: 12,
    // Chỉ hiện nếu nội dung có scroll ngang (tạo padding dưới), trick cho phép kéo ngang
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 24px 0 24px",
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 0,
    letterSpacing: 0.2,
  },
  collapseIcon: {
    color: "#9e9e9e",
    fontSize: 18,
    cursor: "pointer",
    marginLeft: 12,
    userSelect: "none",
  },
  dbNameWrapper: {
    padding: "4px 24px 0 24px",
    overflowX: "auto",
  },
  dbName: {
    fontSize: 13,
    fontFamily: "monospace",
    color: "#b8b8b8",
    whiteSpace: "nowrap",
    display: "inline-block",
    maxWidth: "100%",
  },
  sectionTitle: {
    fontWeight: 500,
    fontSize: 16,
    margin: "20px 0 8px 24px",
  },
  listWrapper: {
    flex: 1,
    overflowY: "auto",
    padding: "0 12px 0 12px",
  },
  tableItem: {
    fontSize: 16,
    color: "#ededed",
    padding: "12px 16px",
    borderRadius: 8,
    margin: "8px 0",
    cursor: "pointer",
    outline: "none",
    border: "none",
    transition: "background 0.16s, color 0.16s",
  },
  activeItem: {
    background: "#08446c",
    color: "#fff",
  },
};

export default Sidebar;
