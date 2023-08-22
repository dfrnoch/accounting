import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { Platform, platform } from "@tauri-apps/plugin-os";
import { useLocation } from "@solidjs/router";
import { useI18n } from "@/i18n";
import { FiBell, FiSearch, FiSidebar } from "solid-icons/fi";

const TitleBar: Component = () => {
  const [os, setOs] = createSignal<Platform | null>(null);

  const location = useLocation();

  const [t] = useI18n();

  const getOs = async () => {
    const osPlatform = await platform();
    setOs(osPlatform);
    console.log(osPlatform);
  };

  const matchPathname = (pathname: string) => {
    switch (pathname) {
      case "/":
        return [t.sidebar_button_overview()];
      case "/sales/invoices":
        return [t.sidebar_section_sales(), t.sidebar_button_invoices()];
      case "/purchase/expenses":
        return [t.sidebar_section_purchase(), t.sidebar_button_expenses()];
      case "/directory/clients":
        return [t.sidebar_section_directory(), t.sidebar_button_clients()];
      case "/settings":
        return [t.sidebar_button_settings()];
      default:
        return [];
    }
  };

  createEffect(() => {
    getOs();
  });

  return (
    <div class="flex fixed top-0 left-0 flex-row w-screen h-[40px] z-50 ">
      <div
        class="flex items-center justify-end w-1/5 h-full lg:max-w-[220px] min-w-[140px] shrink-0 px-2.5 lg:px-4 text-primary"
        data-tauri-drag-region
      />
      <div
        class="flex justify-between items-center px-3 w-4/5 h-full border-b lg:px-6 lg:w-full bg-secondary border-black/20"
        data-tauri-drag-region
      >
        <div class="flex gap-1 items-center h-full text-sm" data-tauri-drag-region>
          <For each={matchPathname(location.pathname)}>
            {(item, index) => (
              <Show
                when={index() === matchPathname(location.pathname).length - 1}
                fallback={
                  <>
                    <span class="text-grey" data-tauri-drag-region>
                      {item}
                    </span>
                    <span class="text-grey" data-tauri-drag-region>
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
        <div class="flex flex-row gap-4 items-center py-1 h-full text-primary">
          <FiSearch />
          <FiBell />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
