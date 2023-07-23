/* @refresh reload */
import { render } from "solid-js/web";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
