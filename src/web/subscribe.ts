import * as vscode from 'vscode';
import {getBaseWebviewHtml} from './utilFuntion'



export function getOpenDbfileSubcriber(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      SQLiteEditorProvider.viewType,
      new SQLiteEditorProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
}


export class SQLiteEditorProvider
  implements vscode.CustomReadonlyEditorProvider {

  public static readonly viewType = "sqliteeditor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  async openCustomDocument(
    uri: vscode.Uri
  ): Promise<vscode.CustomDocument> {
    return { uri, dispose() {} };
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel
  ) {

    // auto pin tab
    setTimeout(() => {
      vscode.commands.executeCommand("workbench.action.keepEditor");
    }, 0);

    webviewPanel.webview.options = {
      enableScripts: true,
    };

    // Đọc DB (WEB EXTENSION)

    const fileData = await vscode.workspace.fs.readFile(document.uri);


    const wasmUri = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "dist", "web", "sql-wasm.wasm")
    );


    webviewPanel.webview.onDidReceiveMessage(msg => {
      if (msg?.type === "webview-ready") {

        const payload = {
        name: document.uri.path.split("/").pop(),
        data: Array.from(fileData),
        wasmUri: wasmUri.toString(),
      }

        webviewPanel.webview.postMessage({
            type: "db-loaded",
            payload: payload
        });
      }
    })

    webviewPanel.webview.html = getBaseWebviewHtml(
        this.context, 
        webviewPanel.webview
    );

  }
}