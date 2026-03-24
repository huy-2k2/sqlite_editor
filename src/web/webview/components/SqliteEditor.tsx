import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { SqliteUtil } from "../../webcore/sqlite";

export type TableColumns = Record<string, string[]>;

interface Props {
  tables: string[],
  tableColumns: TableColumns
}

export default function SqliteEditor({
tables,
tableColumns
}: Props) {
  const monacoRef = useRef<typeof monaco | null>(null);
  const [value, onChange] = useState<string>("")

  const providerRef = useRef<monaco.IDisposable | null>(null);

  useEffect(() => {
    return () => {
      providerRef.current?.dispose();
    };
  }, []);


   /**
   * Register SQL autocomplete
   */
  function registerCompletion(monacoInstance: typeof monaco) {
     // nếu đã register rồi → xoá cái cũ
    providerRef.current?.dispose();

    providerRef.current =
    monacoInstance.languages.registerCompletionItemProvider("sql", {
      triggerCharacters: [" ", ".", ","],

      provideCompletionItems(
        model,
        position,
        _context,
        _token
      ) {
        const textUntilCursor = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // ⭐ REQUIRED FOR TYPESCRIPT
        const word = model.getWordUntilPosition(position);

        const range: monaco.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };


        let suggestions: monaco.languages.CompletionItem[];

        // =========================
        // KEYWORDS
        // =========================
        const keywords = [
          "SELECT",
          "FROM",
          "WHERE",
          "INSERT",
          "INTO",
          "VALUES",
          "UPDATE",
          "SET",
          "DELETE",
          "JOIN",
          "LEFT",
          "RIGHT",
          "INNER",
          "OUTER",
          "ON",
          "ORDER",
          "BY",
          "GROUP",
          "LIMIT",
          "OFFSET",
          "AND",
          "OR",
          "NOT",
          "NULL",
        ];

        // =========================
        // KEYWORD FALLBACK
        // =========================
        suggestions =
          keywords.map((k) => ({
            label: k,
            kind:
              monacoInstance.languages.CompletionItemKind.Keyword,
            insertText: k,
            range,
          }));

        // =========================
        // TABLE COMPLETION
        // =========================
        if (/\b(FROM|JOIN|INTO|UPDATE)\s+$/i.test(textUntilCursor)) {
           suggestions =
            tables.map((t) => ({
              label: t,
              kind:
                monacoInstance.languages.CompletionItemKind.Struct,
              insertText: t,
              detail: "table",
              range,
            }));


          
        }

        // =========================
        // COLUMN COMPLETION
        // =========================
        if (
          /\b(SELECT|WHERE|ON|AND|OR|SET)\s+([\w, ]*)$/i.test(
            textUntilCursor
          )
        ) {
          const allColumns = Array.from(
            new Set(Object.values(tableColumns).flat())
          );

          console.log(allColumns);

           suggestions =
            allColumns.map((col) => ({
              label: col,
              kind:
                monacoInstance.languages.CompletionItemKind.Field,
              insertText: col,
              detail: "column",
              range,
            }));

          
        }

        
        console.log(suggestions);

        return {suggestions}
      },
    });
  }

  /**
   * Monaco mounted
   */
  const handleMount: OnMount = (_editor, monacoInstance) => {
    monacoRef.current = monacoInstance;

    registerCompletion(monacoInstance);
  };

  return (
    <div>
        <Editor
          height="calc(100vh - 170px)"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v || "")}
          onMount={handleMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
    </div>
  );
}