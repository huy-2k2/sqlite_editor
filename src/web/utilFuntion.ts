import * as vscode from 'vscode';

export function createNewPanel(context: vscode.ExtensionContext, panelType: string, panelTitle: string): void {
    const panel = vscode.window.createWebviewPanel(
        panelType,
        panelTitle,
        vscode.ViewColumn.One,
        {
            enableScripts: true,

            // ⭐ BẮT BUỘC: cho phép webview đọc file trong dist
            localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'dist')
            ]
        }
    );
    const webviewJsUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(
            context.extensionUri,
            'dist',
            'web',
            'webview.js'  
        )
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />

        <!-- CSP tối thiểu để chạy JS -->
        <meta
            http-equiv="Content-Security-Policy"
            content="
            default-src 'none';
            script-src ${webviewJsUri};
            style-src 'unsafe-inline';
            "
        />

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

