import React, { useState } from "react";
import TopNav from "./TopNav";

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
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    width: "calc(100vw - 280px)",
    background: "red",
    height: "calc(100vh - 71px)",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
  },
};

export default RightPage;
