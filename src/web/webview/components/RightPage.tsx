import React, { useState } from "react";
import TopNav from "./TopNav";
import TableSchema from "./TableSchema";

let TOPNAV_ITEMS = ["schema", "data"];

interface RightPageProps {
  activeTable: string | undefined;
}

const RightPage: React.FC<RightPageProps> = ({ activeTable }) => {
  const [activeTopnavItem, setActiveTopnavItem] = useState(TOPNAV_ITEMS[0]);

  return (
    <div style={styles.container}>
      <TopNav
        items={TOPNAV_ITEMS}
        activeItem={activeTopnavItem}
        onItemSelect={setActiveTopnavItem}
      ></TopNav>
      <div>
        {activeTopnavItem == "schema" ? (
          <TableSchema activeTable={activeTable}></TableSchema>
        ) : (
          <div></div>
        )}
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
};

export default RightPage;
