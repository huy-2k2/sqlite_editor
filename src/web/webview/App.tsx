import React from "react";

export default function App() {
  return (
    <div className="container">
      <h1>🚀 My VS Code Web Extension</h1>
      <p>React webview is working.</p>

      <button
        onClick={() => {
          console.log("Button clicked");
        }}
      >
        Click me
      </button>
    </div>
  );
}
