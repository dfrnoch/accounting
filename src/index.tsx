import "./styles/index.css";
import "@unocss/reset/tailwind-compat.css";
import "uno.css";

import { render } from "solid-js/web";

import App from "./App";
import { Theme, getTheme, setTheme } from "./utils/theme";

setTheme(getTheme());
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => e.matches && setTheme(Theme.Dark));
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => e.matches && setTheme(Theme.Light));

render(() => <App />, document.getElementById("root") as HTMLElement);
