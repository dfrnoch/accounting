import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import { createEffect, lazy } from "solid-js";
import { useSelector } from "../../utils/store";
import { getCompany } from "../../bindings";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";

const Home = lazy(() => import("./pages/Home"));
const Invoices = lazy(() => import("./pages/Invoices"));

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
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
