import "./styles/index.css";

import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import App from "./App";
import { Theme, getTheme, setTheme } from "./utils/theme";

setTheme(getTheme());
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => e.matches && setTheme(Theme.Dark));
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => e.matches && setTheme(Theme.Light));

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
