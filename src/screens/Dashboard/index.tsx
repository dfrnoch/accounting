import type { ParentComponent } from "solid-js";
import { createEffect } from "solid-js";
import { getCompany } from "../../bindings";
import Sidebar from "./components/Sidebar";
import { useSelector } from "@/store";
import toast, { Toaster } from "solid-toast";

const Dashboard: ParentComponent = (props) => {
  const stateService = useSelector((state) => state.stateService);

  const updateCompany = useSelector((state) => state.companyService.updateCompany);

  const fetchCompany = async () => {
    const companyData = await getCompany(stateService.state.companyId || 1);
    if (!companyData) {
      stateService.updateState({ companyId: 1 });
      return;
    }

    updateCompany(companyData);
    stateService.updateState({ companyId: companyData.id });
  };

  createEffect(() => {
    fetchCompany();
  });

  return (
    <>
      <div class="flex flex-row items-start w-screen">
        <Sidebar />
        <Toaster position="bottom-right" gutter={8} />
        {/* px 4 pt-50px */}
        <div class="overflow-y-auto  mx-auto w-full h-screen pt-40px no-scrollbar bg-primary text-primary">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
