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
    if (companyId === 0) {
      navigate("/login");
      return;
    }

    const companyData = await getCompany(companyId);
    if (!companyData) {
      navigate("/login");
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
      <Suspense fallback={<LoadingIcon />}>
        <Show when={company()}>
          <Sidebar />
          <div
            class="overflow-y-auto mx-auto w-full h-screen pt-40px no-scrollbar bg-primary text-primary"
            classList={{
              "rounded-tl-xl": state.platform === "windows",
            }}
          >
            {props.children}
          </div>
        </Show>
      </Suspense>
    </div>
  );
};

export default Dashboard;
