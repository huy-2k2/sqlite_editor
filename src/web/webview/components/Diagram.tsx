import React from "react";

import { SqliteUtil } from "../../webcore/sqlite";

import { useEffect, useRef } from "react";
import Container from "@mui/material/Container";

interface DiagramProps {
  databaseName: string;
}

const Diagram: React.FC<DiagramProps> = ({ databaseName }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
      });

      if (!ref.current || cancelled) return;

      try {
        const chart = SqliteUtil.sqljsDbToMermaidChart();
        const id = "erd-" + Math.random().toString(36).slice(2);
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function downloadSVGFromRef() {
    const filename = `${databaseName}.svg`;
    if (!ref.current) return;

    const svgEl = ref.current.querySelector("svg");
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);

    // đảm bảo namespace (tránh lỗi browser)
    if (!source.includes("xmlns=")) {
      source = source.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.container}>
      <div>
        <button
          onClick={() => {
            downloadSVGFromRef();
          }}
          style={styles.downloadbutton}
        >
          Download SVG diagram
        </button>
      </div>
      <div ref={ref} />;
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {},

  downloadbutton: {
    padding: "6px 12px",
    borderRadius: "4px",
    backgroundColor: "#08446c",
    color: "#fff",
    cursor: "pointer",
    border: "none",
    margin: "8px 12px",
  },
};

export default Diagram;
