import * as vscode from 'vscode';
import {getHelloworldSubcriber, getOpenDbfileSubcriber} from './subscribe'


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(getOpenDbfileSubcriber(context));
}



