import { lazy } from "solid-js";
import "./styles/index.css";
import "@unocss/reset/tailwind-compat.css";
import "uno.css";

const Overview = lazy(() => import("./screens/Dashboard/pages"));
const Invoices = lazy(() => import("./screens/Dashboard/pages/Sales/Invoices"));
const ManageInvoice = lazy(() => import("./screens/Dashboard/pages/Sales/Invoices/ManageInvoice"));
const InvoiceTemplates = lazy(() => import("./screens/Dashboard/pages/Sales/Templates"));
const Templates = lazy(() => import("./screens/Dashboard/pages/Other/Templates"));
const ManageTemplates = lazy(() => import("./screens/Dashboard/pages/Other/Templates/ManageTemplate"));
const Schedules = lazy(() => import("./screens/Dashboard/pages/Sales/Schedules"));
const Expenses = lazy(() => import("./screens/Dashboard/pages/Purchase/Expenses"));
const Clients = lazy(() => import("./screens/Dashboard/pages/Other/Clients"));
const RecievedInvoices = lazy(() => import("./screens/Dashboard/pages/Purchase/ReceivedInvoices"));
const ClientDetail = lazy(() => import("./screens/Dashboard/pages/Other/Clients/ClientDetail"));
const ManageClient = lazy(() => import("./screens/Dashboard/pages/Other/Clients/ManageClient"));
const Reports = lazy(() => import("./screens/Dashboard/pages/Other/Reports"));
const Settings = lazy(() => import("./screens/Dashboard/pages/Settings"));
const Dashboard = lazy(() => import("./screens/Dashboard"));
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
      <Route path="/print/:id" component={App} />
      <Route path="/setup" component={Setup} />
      <Route path="/dashboard" component={Dashboard}>
        <Route path="/" component={Overview} />
        <Route path="/sales">
          <Route path="/invoices">
            <Route path="/" component={Invoices} />
            <Route path="/:id" component={ManageInvoice} />
          </Route>
          <Route path="/templates" component={InvoiceTemplates} />
          <Route path="/schedules" component={Schedules} />
        </Route>
        <Route path="/other">
          <Route path="/clients">
            <Route path="/" component={Clients} />
            <Route path="/detail/:id" component={ClientDetail} />
            <Route path="/new" component={ManageClient} />
            <Route path="/:id" component={ManageClient} />
          </Route>
          <Route path="/reports" component={Reports} />
          <Route path="/templates">
            <Route path="/" component={Templates} />
            <Route path="/new" component={ManageTemplates} />
            <Route path="/:id" component={ManageTemplates} />
          </Route>
        </Route>
        <Route path="/purchase/">
          <Route path="/expenses" component={Expenses} />
          <Route path="/recieved" component={RecievedInvoices} />
        </Route>
        <Route path="/settings" component={Settings} />
        <Route path="*" component={() => <Navigate href={"/dashboard"} />} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
