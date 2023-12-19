import { lazy } from "solid-js";

import "./styles/index.css";
import "@unocss/reset/tailwind-compat.css";
import "uno.css";

const Overview = lazy(() => import("./screens/Dashboard/pages"));
const Invoices = lazy(() => import("./screens/Dashboard/pages/Sales/Invoices"));
const Expenses = lazy(() => import("./screens/Dashboard/pages/Purchase/Expenses"));
const Clients = lazy(() => import("./screens/Dashboard/pages/Other/Clients"));
const Reports = lazy(() => import("./screens/Dashboard/pages/Other"));
const Settings = lazy(() => import("./screens/Dashboard/pages/Settings"));
const Dashboard = lazy(() => import("./screens/Dashboard"));
const Setup = lazy(() => import("./screens/Setup"));
const App = lazy(() => import("./App"));
const Loader = lazy(() => import("./Loader"));

import { render } from "solid-js/web";

import { Theme, getTheme, setTheme } from "./utils/theme";
import { Route, Router } from "@solidjs/router";

setTheme(getTheme());
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => e.matches && setTheme(Theme.Dark));
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => e.matches && setTheme(Theme.Light));

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Loader} />
      <Route path="/setup" component={Setup} />
      <Route path="/dashboard" component={Dashboard}>
        <Route path="/" component={Overview} />
        <Route path="/sales">
          <Route path="/invoices" component={Invoices} />
        </Route>
        <Route path="/other/clients" component={Clients} />
        <Route path="/other/reports" component={Reports} />
        <Route path="/purchase/expenses" component={Expenses} />
        <Route path="/settings" component={Settings} />
        <Route path="*" component={Overview} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
