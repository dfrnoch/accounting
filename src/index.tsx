import { lazy } from "solid-js";
import "./styles/index.css";
import "@unocss/reset/tailwind-compat.css";
import "uno.css";

const Overview = lazy(() => import("./screens/Dashboard/pages"));
const Invoices = lazy(() => import("./screens/Dashboard/pages/Sales/Invoices"));
const ManageInvoice = lazy(() => import("./screens/Dashboard/pages/Sales/Invoices/ManageInvoice"));
const ManageProforma = lazy(() => import("./screens/Dashboard/pages/Sales/Proformas/ManageProforma"));
const ManageReceived = lazy(() => import("./screens/Dashboard/pages/Sales/ReceivedInvoices/ManageReceived"));
const ReceivedInvoices = lazy(() => import("./screens/Dashboard/pages/Sales/ReceivedInvoices"));
const Proformas = lazy(() => import("./screens/Dashboard/pages/Sales/Proformas"));
const Templates = lazy(() => import("./screens/Dashboard/pages/Other/Templates"));
const ManageTemplates = lazy(() => import("./screens/Dashboard/pages/Other/Templates/ManageTemplate"));
const Clients = lazy(() => import("./screens/Dashboard/pages/Other/Clients"));
const Print = lazy(() => import("./screens/Print"));
const Currencies = lazy(() => import("./screens/Dashboard/pages/Other/Currencies"));
const ManageCurrency = lazy(() => import("./screens/Dashboard/pages/Other/Currencies/ManageCurrency"));
const ClientDetail = lazy(() => import("./screens/Dashboard/pages/Other/Clients/ClientDetail"));
const ManageClient = lazy(() => import("./screens/Dashboard/pages/Other/Clients/ManageClient"));
const Settings = lazy(() => import("./screens/Dashboard/pages/Settings"));
const Dashboard = lazy(() => import("./screens/Dashboard"));
const Login = lazy(() => import("./screens/Login"));
const Setup = lazy(() => import("./screens/Setup"));
const App = lazy(() => import("./App"));
const Loader = lazy(() => import("./Loader"));

import { render } from "solid-js/web";
import { Theme, getTheme, setTheme } from "./utils/theme";
import { Navigate, Route, Router } from "@solidjs/router";

setTheme(getTheme());

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  setTheme(e.matches ? Theme.Dark : Theme.Light);
});

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Loader} />
      <Route path="/print/:id" component={Print} />
      <Route path="/setup" component={Setup} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard}>
        <Route path="/" component={Overview} />
        <Route path="/sales">
          <Route path="/invoices">
            <Route path="/" component={Invoices} />
            <Route path="/new" component={ManageInvoice} />
            <Route path="/:id" component={ManageInvoice} />
          </Route>
          <Route path="/received">
            <Route path="/" component={ReceivedInvoices} />
            <Route path="/new" component={ManageReceived} />
            <Route path="/:id" component={ManageReceived} />
          </Route>
          <Route path="/proformas">
            <Route path="/" component={Proformas} />
            <Route path="/new" component={ManageProforma} />
            <Route path="/:id" component={ManageProforma} />
          </Route>
        </Route>
        <Route path="/other">
          <Route path="/clients">
            <Route path="/" component={Clients} />
            <Route path="/detail/:id" component={ClientDetail} />
            <Route path="/new" component={ManageClient} />
            <Route path="/:id" component={ManageClient} />
          </Route>
          <Route path="/currencies">
            <Route path="/" component={Currencies} />
            <Route path="/new" component={ManageCurrency} />
            <Route path="/:id" component={ManageCurrency} />
          </Route>
          <Route path="/templates">
            <Route path="/" component={Templates} />
            <Route path="/new" component={ManageTemplates} />
            <Route path="/:id" component={ManageTemplates} />
          </Route>
        </Route>
        <Route path="/settings" component={Settings} />
        <Route path="*" component={() => <Navigate href={"/login"} />} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
