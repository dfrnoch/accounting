import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import { createEffect, lazy } from "solid-js";
import { getCompany } from "../../bindings";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import { useSelector } from "@/store";

const Overview = lazy(() => import("./pages/Overview/Overview"));
const Invoices = lazy(() => import("./pages/Sales/Invoices/Invoices"));
const Expenses = lazy(() => import("./pages/Purchase/Expenses/Expenses"));
const Clients = lazy(() => import("./pages/Directory/Clients/Clients"));

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
        <div class="container px-4 pt-10 mx-auto w-full h-screen">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/sales/invoices" element={<Invoices />} />
            <Route path="/directory/clients" element={<Clients />} />
            <Route path="/purchase/expenses" element={<Expenses />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
