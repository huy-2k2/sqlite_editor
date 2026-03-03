import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monacoType from "monaco-editor";

const schema: Record<string, string[]> = {
  users: ["id", "name", "email"],
  orders: ["id", "user_id", "total"],
  products: ["id", "title", "price"],
};

export default function SqlEditor() {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    // Register autocomplete
    monaco.languages.registerCompletionItemProvider("sql", {
      triggerCharacters: [" ", ".", ","],

      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);

        const range: monacoType.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const textBeforeCursor = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const suggestions: monacoType.languages.CompletionItem[] = [];

        // 1️⃣ SELECT → gợi ý "* FROM"
        if (/select\s*$/i.test(textBeforeCursor)) {
          suggestions.push({
            label: "*",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "* FROM ",
            range,
          });
        }

        // 2️⃣ FROM → gợi ý table
        if (/from\s+\w*$/i.test(textBeforeCursor)) {
          Object.keys(schema).forEach((table) => {
            suggestions.push({
              label: table,
              kind: monaco.languages.CompletionItemKind.Struct,
              insertText: table,
              range,
            });
          });
        }

        // 3️⃣ table. → gợi ý column
        const tableMatch = textBeforeCursor.match(/from\s+(\w+)/i);

        if (tableMatch && textBeforeCursor.endsWith(".")) {
          const table = tableMatch[1];
          const columns = schema[table];

          if (columns) {
            columns.forEach((col) => {
              suggestions.push({
                label: col,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: col,
                range,
              });
            });
          }
        }

        return { suggestions };
      },
    });
  }, [monaco]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="sql"
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        wordWrap: "on",
      }}
    />
  );
}