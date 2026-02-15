import * as vscode from 'vscode';
import {getHelloworldSubcriber} from './subscribe'


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(getHelloworldSubcriber(context));
}



