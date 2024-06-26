import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";

export async function getInitializedPrintWindow(id: number) {
  const appWindow = new Window("document", {
    visible: true,
    decorations: true,
    title: "Document",
    width: 1000,
    height: 1000,
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const webview = new Webview(appWindow, "documentweb", {
    url: `/print/${id}`,
    width: 1000,
    height: 1000,
    transparent: true,
    x: 0,
    y: 0,
  });
  webview.once("tauri://error", (e) => {
    // an error happened creating the webview
    console.error(e);
  });
}
