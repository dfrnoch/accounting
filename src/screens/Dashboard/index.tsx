import type { ParentComponent } from "solid-js";
import { onMount } from "solid-js";
import { getCompany } from "../../bindings";
import Sidebar from "./components/Sidebar";
import { useSelector } from "@/store";

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

  onMount(fetchCompany);

  return (
    <div class="flex flex-row items-start w-screen">
      <Sidebar />
      {/* px 4 pt-50px */}
      <div class="overflow-y-auto mx-auto w-full h-screen pt-40px no-scrollbar bg-primary text-primary ">
        {props.children}
      </div>
    </div>
  );
};

export default Dashboard;
