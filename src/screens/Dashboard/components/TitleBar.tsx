import { type Component, For, Show, createMemo } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { useI18n } from "@/i18n";
import { FiBell, FiChevronLeft, FiChevronRight, FiSearch } from "solid-icons/fi";

const TitleBar: Component = () => {
  const location = useLocation();
  const [t] = useI18n();
  const navigate = useNavigate();

  const matchDynamicRoute = (route: string) => {
    const dynamicRoute = route.replace(/\{.*?\}/g, "(.+)");
    const regex = new RegExp(`^${dynamicRoute}$`);
    const match = location.pathname.match(regex);
    return match ? [route.split("/").slice(-1)[0], match[1]] : null;
  };

  const matchPathname = createMemo(() => {
    const { pathname } = location;
    switch (pathname.replace(/\/$/, "")) {
      case "/dashboard":
        return [t("sidebar.button.overview")];

      case "/dashboard/sales/invoices":
        return [t("sidebar.section.sales"), t("sidebar.button.invoices")];
      case "/dashboard/sales/invoices/new":
        return [t("sidebar.section.sales"), t("sidebar.button.invoices"), "new"];
      case "/dashboard/sales/templates":
        return [t("sidebar.section.sales"), t("sidebar.button.templates")];
      case "/dashboard/sales/schedules":
        return [t("sidebar.section.sales"), t("sidebar.button.schedules")];

      case "/dashboard/purchase/expenses":
        return [t("sidebar.section.purchase"), t("sidebar.button.expenses")];
      case "/dashboard/other/clients":
        return [t("sidebar.section.other"), t("sidebar.button.clients")];
      case "/dashboard/other/reports":
        return [t("sidebar.section.other"), t("sidebar.button.reports")];
      case "/dashboard/settings":
        return [t("sidebar.button.settings")];
      default: {
        const clientMatch = matchDynamicRoute("/dashboard/other/clients/{id}");
        const invoiceMatch = matchDynamicRoute("/dashboard/sales/invoices/{id}");
        if (clientMatch) {
          return [t("sidebar.section.other"), t("sidebar.button.clients"), clientMatch[1]];
        }
        if (invoiceMatch) {
          return [t("sidebar.section.sales"), t("sidebar.button.invoices"), invoiceMatch[1]];
        }

        return [];
      }
    }
  });

  return (
    <div class="flex fixed top-0 left-0 flex-row w-screen h-[40px] z-50 ">
      <div
        class="flex items-center justify-end w-1/5 h-full lg:max-w-[220px] min-w-[200px] shrink-0 px-2.5 lg:px-4 text-primary"
        data-tauri-drag-region
      />
      <div
        class="flex justify-between items-center px-3 w-4/5 h-full border-b lg:px-6 lg:w-full  border-black/20  backdrop-blur-lg bg-[#E3E3E3]/80 dark:bg-[#262626]/80 z-5"
        data-tauri-drag-region
      >
        <div class="flex flex-row h-full">
          <div
            class="flex items-center justify-center text-white gap-3 text-sm font-semibold mr-5"
            data-tauri-drag-region
          >
            <button
              class="rounded hover:bg-fills-opaque-4 bg-transparent transition-all p-1 flex items-center justify-center text-primary"
              type="button"
              onClick={() => navigate(-1)}
            >
              <FiChevronLeft class="w-5 h-5 " />
            </button>

            <button
              class="rounded hover:bg-fills-opaque-4 bg-transparent transition-all p-1 flex items-center justify-center text-primary"
              type="button"
              onClick={() => navigate(1)}
            >
              <FiChevronRight class="w-5 h-5" />
            </button>
          </div>
          <div class="flex gap-1 items-center h-full text-sm font-semibold" data-tauri-drag-region>
            <For each={matchPathname()}>
              {(item, index) => (
                <Show
                  when={index() === matchPathname().length - 1}
                  fallback={
                    <>
                      <span class="text-secondary" data-tauri-drag-region>
                        {item}
                      </span>
                      <span class="text-secondary" data-tauri-drag-region>
                        /
                      </span>
                    </>
                  }
                >
                  <span class="text-primary" data-tauri-drag-region>
                    {item}
                  </span>
                </Show>
              )}
            </For>
          </div>
        </div>
        <div class="flex flex-row gap-4 items-center py-1 h-full text-primary">
          <FiSearch />
          <FiBell />
        </div>
      </div>
    </div>
  );
};
export default TitleBar;
