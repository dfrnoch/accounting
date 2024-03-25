import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
// import { App, BrowserWindow } from "electron";
// import fs from "fs/promises";
// import path from "path";

// export async function saveHtmlAsPdf(
//   html: string,
//   savePath: string,
//   app: App,
//   width: number, // centimeters
//   height: number, // centimeters
// ): Promise<boolean> {
//   /**
//    * Store received html as a file in a tempdir,
//    * this will be loaded into the print view
//    */
//   const tempRoot = app.getPath("temp");
//   const filename = path.parse(savePath).name;
//   const htmlPath = path.join(tempRoot, `${filename}.html`);
//   await fs.writeFile(htmlPath, html, { encoding: "utf-8" });

//   const printWindow = await getInitializedPrintWindow(htmlPath, width, height);
//   const printOptions = {
//     margins: { top: 0, bottom: 0, left: 0, right: 0 }, // equivalent to previous 'marginType: 1'
//     pageSize: {
//       height: height / 2.54, // Convert from centimeters to inches
//       width: width / 2.54, // Convert from centimeters to inches
//     },
//     printBackground: true,
//   };

//   const data = await printWindow.webContents.printToPDF(printOptions);
//   await fs.writeFile(savePath, data);
//   printWindow.close();
//   await fs.unlink(htmlPath);
//   return true;
// }

export async function getInitializedPrintWindow(width: number, height: number) {
  const appWindow = new Window("invoice", {
    visible: false,
    decorations: false,
    title: "Invoice",
  });
  const webview = new Webview(appWindow, "invoice", {
    url: "/print.html",
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
