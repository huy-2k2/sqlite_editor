import React, { useEffect, useState } from "react";
import TopNav from "./TopNav";
import TableSchema from "./TableSchema";
import TableDataManager, { Table } from "./TableDataManager";
import Diagram from "./Diagram";
import Query from "./Query";

let TOPNAV_ITEMS = ["schema", "data", "query", "diagram"];



interface RightPageProps {
  activeTable: string | undefined;
  onTableSelect: (name: string) => void;
  databaseName: string;
}

const RightPage: React.FC<RightPageProps> = ({
  activeTable,
  onTableSelect,
  databaseName,
}) => {
  const [activeTopnavItem, setActiveTopnavItem] = useState<string>(
    TOPNAV_ITEMS[0],
  );

  const [listTableSelected, setListTableSelected] = useState<Array<Table>>([]);

  const [tableSelected, setTableSelected] = useState<string>();

  const [queryText, SetQueryText] = useState<string>("");

  useEffect(() => {
    if (!activeTable) return;

    setTableSelected(activeTable);

    if (!listTableSelected) return;
    const isTableAlreadyInList =
      listTableSelected.findIndex((tb) => tb.tableName == activeTable) != -1;

    if (isTableAlreadyInList || activeTopnavItem != "data") return;
    setListTableSelected((listTable) => {
      const newtb: Table = {
        tableName: activeTable,
        tableQuery: "",
        paginationModel: {
          pageSize: 100,
          page: 0,
        },
        sortModel: undefined,
        filterModel: undefined,
      };

      const tbs = [...listTable, newtb];
      return tbs;
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
      case "diagram":
        return <Diagram databaseName={databaseName}></Diagram>;
      case "query":
        return <Query
          queryText={queryText}
          setQueryText={SetQueryText}
        ></Query>;
    }
  };

  return (
    <div style={styles.container}>
      <TopNav
        items={TOPNAV_ITEMS}
        activeItem={activeTopnavItem}
        onItemSelect={setActiveTopnavItem}
      ></TopNav>
      <div
        className="sidebar-scroll"
        style={activeTopnavItem == "diagram" ? styles.container_diagram : {}}
      >
        {renderByType()}
      </div>
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

  container_diagram: {
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
};

export default RightPage;
