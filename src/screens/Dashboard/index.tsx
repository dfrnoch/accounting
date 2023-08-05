import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import Layout from "../../components/Dashboard/Layout";
import { createEffect, lazy } from "solid-js";
import { useSelector } from "../../utils/store";
import { getCompany } from "../../bindings";

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
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
