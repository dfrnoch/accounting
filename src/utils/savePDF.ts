import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";

export async function getInitializedPrintWindow(id: number) {
  const appWindow = new Window("invoice", {
    visible: false,
    decorations: true,
    title: "Invoice (Print)",
    width: 200,
    height: 200,
  });
  const webview = new Webview(appWindow, "invoice", {
    url: `/print/${id}`,
    width: 2100,
    height: 2970,
    transparent: true,
    x: 0,
    y: 0,
  });
  webview.once("tauri://created", () => {
    console.log("webview created");
    // get pdf
  });
  webview.once("tauri://error", (e) => {
    // an error happened creating the webview
    console.error(e);
    appWindow.close();
  });
}
