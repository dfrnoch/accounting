import type { ParentComponent } from "solid-js";
import { Show, Suspense, createResource } from "solid-js";
import { getCompany } from "../../bindings";
import Sidebar from "./components/Sidebar";
import { useNavigate } from "@solidjs/router";
import toast from "solid-toast";
import { useSelector } from "@/store";
import LoadingIcon from "@/shared/components/LoadingIcon";

const Dashboard: ParentComponent = (props) => {
  const navigate = useNavigate();
  const state = useSelector((state) => state.stateService.state);

  const companyService = useSelector((state) => state.companyService);
  const settingsService = useSelector((state) => state.settingsService);

  const fetchCompany = async (companyId: number) => {
    if (!companyId) {
      navigate("/setup");
      return;
    }

    const companyData = await getCompany(companyId);
    if (!companyData) {
      navigate("/setup");
      toast.error("Company not found");
      return;
    }

    await companyService.updateCompany();
    await settingsService.updateSettings();

    return companyData;
  };

  const [company] = createResource(state.companyId, fetchCompany);

  return (
    <div class="flex flex-row items-start w-screen">
      <Sidebar />
      <div class="overflow-y-auto mx-auto w-full h-screen pt-40px no-scrollbar bg-primary text-primary">
        <Suspense fallback={<LoadingIcon />}>
          <Show when={company()}>{props.children}</Show>
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
