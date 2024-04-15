import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";

export async function getInitializedPrintWindow(id: number) {
  const appWindow = new Window("invoice", {
    visible: false,
    decorations: false,
    title: "Invoice",
  });
  const webview = new Webview(appWindow, "invoice", {
    url: `/print/${id}`,
    width: 1000,
    height: 1000,
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

  //   await printWindow.loadFile(printFilePath);
  //   return printWindow;
}
