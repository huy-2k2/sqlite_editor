import React from "react";

interface TopNavProps {
  items: string[];
  activeItem: string;
  onItemSelect: (item: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ items, activeItem, onItemSelect }) => (
  <nav style={styles.nav}>
    {items.map((item, idx) => (
      <button
        key={item}
        style={{
          ...styles.tab,
          ...(activeItem === item ? styles.activeTab : {}),
          // Không border phải cho item cuối cùng
          borderRight:
            idx === items.length - 1 ? "none" : styles.tab.borderRight,
        }}
        onClick={() => onItemSelect(item)}
        aria-pressed={activeItem === item}
        tabIndex={0}
      >
        {item}
      </button>
    ))}
  </nav>
);

const styles: { [k: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    background: "#232323",
    borderBottom: "1px solid #333",
    paddingLeft: 0,
    height: 48,
  },
  tab: {
    background: "#292929",
    color: "#cfcfcf",
    border: "none",
    borderRight: "1px solid #333",
    fontSize: 17,
    fontWeight: 400,
    padding: "0 36px",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    transition: "background 0.13s, color 0.13s",
    position: "relative",
  },
  activeTab: {
    background: "#08446c",
    color: "#fff",
    fontWeight: 500,
  },
};

export default TopNav;
