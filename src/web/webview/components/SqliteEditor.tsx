import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { SqliteUtil } from "../../webcore/sqlite";

export type TableColumns = Record<string, string[]>;

export interface SqlEditorHandle {
  getSelectedText: () => string | null;
}

export interface SqliteEditorHandle {
  getSelectedText: () => string | null;
}

interface Props {
  tables: string[];
  tableColumns: TableColumns;
  defaultText: string;
  setDefaultText(newText: string): void;
}
const SqliteEditor = forwardRef<SqliteEditorHandle, Props>(
  ({ tables, tableColumns, defaultText, setDefaultText }, ref) => {
    const monacoRef = useRef<typeof monaco | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [value, onChange] = useState<string>("");

    const handleOnChange = function (value: string): void {
      onChange(value || "");
      setDefaultText(value || "");
    };

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

          provideCompletionItems(model, position, _context, _token) {
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
            suggestions = keywords.map((k) => ({
              label: k,
              kind: monacoInstance.languages.CompletionItemKind.Keyword,
              insertText: k,
              range,
            }));

            // =========================
            // TABLE COMPLETION
            // =========================
            if (/\b(FROM|JOIN|INTO|UPDATE)\s+$/i.test(textUntilCursor)) {
              suggestions = tables.map((t) => ({
                label: t,
                kind: monacoInstance.languages.CompletionItemKind.Struct,
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
                textUntilCursor,
              )
            ) {
              const allColumns = Array.from(
                new Set(Object.values(tableColumns).flat()),
              );

              suggestions = allColumns.map((col) => ({
                label: col,
                kind: monacoInstance.languages.CompletionItemKind.Field,
                insertText: col,
                detail: "column",
                range,
              }));
            }
            return { suggestions };
          },
        });
    }

    /**
     * Monaco mounted
     */
    const handleMount: OnMount = (_editor, monacoInstance) => {
      editorRef.current = _editor;
      monacoRef.current = monacoInstance;
      registerCompletion(monacoInstance);
    };

    // 👇 expose API ra parent
    useImperativeHandle(ref, () => ({
      getSelectedText() {
        const editor = editorRef.current;
        if (!editor) return null;

        const model = editor.getModel();
        const selection = editor.getSelection();

        if (!model || !selection || selection.isEmpty()) {
          return null;
        }

        return model.getValueInRange(selection);
      },
    }));

    return (
      <div>
        <Editor
          height="calc(100vh - 71px)"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={(v) => handleOnChange(v || "")}
          onMount={handleMount}
          defaultValue={defaultText}
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
  },
);

export default SqliteEditor;
