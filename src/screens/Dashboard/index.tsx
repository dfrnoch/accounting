import { Route, Router } from "@solidjs/router";
import type { Component, ParentComponent } from "solid-js";
import { createEffect, lazy } from "solid-js";
import { getCompany } from "../../bindings";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import { useSelector } from "@/store";

const Dashboard: ParentComponent = (props) => {
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
          <div class="container">{props.children}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
