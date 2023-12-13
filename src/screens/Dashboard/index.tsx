import { Route, Router } from "@solidjs/router";
import type { Component } from "solid-js";
import { createEffect, lazy } from "solid-js";
import { getCompany } from "../../bindings";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import { useSelector } from "@/store";

const Overview = lazy(() => import("./pages"));
const Invoices = lazy(() => import("./pages/Sales/Invoices"));
const Expenses = lazy(() => import("./pages/Purchase/Expenses"));
const Clients = lazy(() => import("./pages/Other/Clients"));
const Reports = lazy(() => import("./pages/Other"));
const Settings = lazy(() => import("./pages/Settings"));

const Dashboard: Component = () => {
  const {
    companyService: { updateCompany },
    stateService: { state, updateState },
  } = useSelector();

  const fetchCompany = async () => {
    const companyData = await getCompany(state.companyId || 1);
    if (!companyData) {
      updateState({ companyId: 1 });
      return;
    }

    updateCompany(companyData);
    updateState({ companyId: companyData.id });
  };

  createEffect(() => {
    fetchCompany();
  });

  return (
    <>
      <TitleBar />
      <div class="flex flex-row items-start w-screen">
        <Sidebar />
        <div class="overflow-y-auto px-4 pt-14 mx-auto w-full h-screen no-scrollbar bg-secondary text-primary">
          <div class="container">
            <Router>
              <Route path="/" component={Overview} />
              <Route path="/sales/invoices" component={Invoices} />
              <Route path="/other/clients" component={Clients} />
              <Route path="/other/reports" component={Reports} />
              <Route path="/purchase/expenses" component={Expenses} />
              <Route path="/settings" component={Settings} />
              <Route path="*" component={Overview} />
            </Router>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
