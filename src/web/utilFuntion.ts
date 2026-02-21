import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined;

export function createNewPanel(context: vscode.ExtensionContext, panelType: string, panelTitle: string): vscode.WebviewPanel {
    // Nếu đã có panel → reuse
    if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
        return currentPanel;
    }
    currentPanel = vscode.window.createWebviewPanel(
        panelType,
        panelTitle,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            // ⭐ BẮT BUỘC: cho phép webview đọc file trong dist
            localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'dist'),
            ],
            retainContextWhenHidden: true,
        }
    );
    const webviewJsUri = currentPanel.webview.asWebviewUri(
        vscode.Uri.joinPath(
            context.extensionUri,
            'dist',
            'web',
            'webview.js'  
        )
    );


    currentPanel.webview.html = getBaseWebviewHtml(context, currentPanel.webview);

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
    
    return currentPanel;
}


export function getBaseWebviewHtml(context: vscode.ExtensionContext,  webview: vscode.Webview): string {
    const webviewJsUri = webview.asWebviewUri(
        vscode.Uri.joinPath(
            context.extensionUri,
            'dist',
            'web',
            'webview.js'  
        )
    );

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SQLite Viewer</title>
        </head>

        <body>
        <div id="root"></div>

        <!-- ⭐ React bundle -->
        <script src="${webviewJsUri}"></script>
        </body>
        </html>
    `;
}

