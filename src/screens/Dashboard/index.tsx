import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import { createEffect, lazy } from "solid-js";
import { getCompany } from "../../bindings";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import { useSelector } from "@/store";

const Home = lazy(() => import("./pages/Home/Home"));
const Invoices = lazy(() => import("./pages/Invoices/Invoices"));
const Expenses = lazy(() => import("./pages/Expenses/Expenses"));
const Clients = lazy(() => import("./pages/Clients/Clients"));

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
    <div class="flex flex-row w-screen">
      <TitleBar />
      <Sidebar />
      <div class="w-4/5 xl:w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
