// vscode.d.ts
export {};

declare global {
  interface Window {
    acquireVsCodeApi(): {
      postMessage(message: any): void;
      setState(state: any): void;
      getState(): any;
    };
  }
}