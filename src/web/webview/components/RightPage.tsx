import React, { useEffect, useState } from "react";
import TopNav from "./TopNav";
import TableSchema from "./TableSchema";
import TableDataManager, { Table } from "./TableDataManager";

let TOPNAV_ITEMS = ["schema", "data"];

interface RightPageProps {
  activeTable: string | undefined;
  onTableSelect: (name: string) => void;
}

const RightPage: React.FC<RightPageProps> = ({
  activeTable,
  onTableSelect,
}) => {
  const [activeTopnavItem, setActiveTopnavItem] = useState<string>(
    TOPNAV_ITEMS[0],
  );

  const [listTableSelected, setListTableSelected] = useState<Array<Table>>([]);

  const [tableSelected, setTableSelected] = useState<string>();

  useEffect(() => {
    if (!activeTable) return;

    setTableSelected(activeTable);

    if (!listTableSelected) return;
    const isTableAlreadyInList =
      listTableSelected.findIndex((tb) => tb.tableName == activeTable) != -1;

    if (isTableAlreadyInList || activeTopnavItem != "data") return;
    setListTableSelected((listTable) => {
      return [
        ...listTable,
        {
          tableName: activeTable,
          tableQuery: "",
        },
      ];
    });
  }, [activeTable, activeTopnavItem]);

  const renderByType = () => {
    switch (activeTopnavItem) {
      case "schema":
        return <TableSchema activeTable={activeTable}></TableSchema>;
      case "data":
        return (
          <TableDataManager
            listTable={listTableSelected}
            tableSelected={tableSelected}
            onTableSelect={onTableSelect}
            setListTableSelected={setListTableSelected}
          ></TableDataManager>
        );
    }
  };

  return (
    <div style={styles.container}>
      <TopNav
        items={TOPNAV_ITEMS}
        activeItem={activeTopnavItem}
        onItemSelect={setActiveTopnavItem}
      ></TopNav>
      <div>{renderByType()}</div>
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    width: "calc(100vw - 280px)",
    height: "calc(100vh - 71px)",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#232323",
  },
};

export default RightPage;
