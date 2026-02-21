import { useEffect, useState } from "react";
import FullFeaturedCrudGrid from "./FullFeaturedCrudGrid";

import {
  GridPaginationModel,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";

export interface Table {
  tableName: string;
  tableQuery: string;
  paginationModel: GridPaginationModel | undefined;
  filterModel: GridFilterModel | undefined;
  sortModel: GridSortModel | undefined;
}

interface TableDataManagerProps {
  listTable: Array<Table> | undefined;
  tableSelected: string | undefined;
  onTableSelect: (name: string) => void;
  setListTableSelected(tables: Array<Table>): void;
}

const TableDataManager: React.FC<TableDataManagerProps> = ({
  listTable,
  tableSelected,
  onTableSelect,
  setListTableSelected,
}) => {
  function handleTableItemClick(table: Table): void {
    if (table.tableQuery) return;

    onTableSelect(table.tableName);
  }

  function handleRemoveTableItem(table: Table, event: React.MouseEvent): void {
    event.stopPropagation();

    if (!listTable || listTable?.length <= 1) return;

    const newListTable = listTable.filter((t) => {
      return t.tableName != table.tableName;
    });

    setListTableSelected(newListTable);
    if (table.tableName == tableSelected)
      onTableSelect(newListTable[0].tableName);
  }

  return (
    <div>
      <div style={styles.tablelist} className="sidebar-scroll">
        {listTable?.map((t) => (
          <div
            key={t.tableName}
            onClick={() => handleTableItemClick(t)}
            style={{
              ...styles.tableItem,
              ...(t.tableName == tableSelected ? styles.tableItemActive : {}),
            }}
          >
            {t.tableName}
            <div
              onClick={(e) => handleRemoveTableItem(t, e)}
              style={styles.closeItem}
            >
              <span style={styles.iconClose}>x</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <FullFeaturedCrudGrid
          key={tableSelected}
          tableSelected={tableSelected}
          listTable={listTable}
          setListTableSelected={setListTableSelected}
        ></FullFeaturedCrudGrid>
      </div>
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  tablelist: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    gap: "10px",
    overflowX: "scroll",
  },
  tableItem: {
    borderRadius: "6px",
    padding: "8px 16px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    position: "relative",
  },
  tableItemActive: {
    backgroundColor: "#08446c",
  },

  closeItem: {
    position: "absolute",
    top: "1px",
    right: "1px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "rgb(255 0 0 / 50%)",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  iconClose: {
    marginBottom: "4px",
  },
};

export default TableDataManager;
