import * as vscode from 'vscode';
import {createNewPanel} from './utilFuntion'
export function getHelloworldSubcriber(context: vscode.ExtensionContext, ) : vscode.Disposable {
    return vscode.commands.registerCommand('sqliteeditor.helloworld', () => {
        createNewPanel(context, 'sqliteeditor', 'Sqlite Editor')
    })
}


export function getOpenDbfileSubcriber(content: vscode.ExtensionContext): vscode.Disposable {
    return vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.uri.fsPath.endsWith(".db")) {
        }
    })
}