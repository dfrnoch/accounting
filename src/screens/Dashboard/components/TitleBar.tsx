import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { Platform, platform } from "@tauri-apps/plugin-os";
import { useLocation } from "@solidjs/router";
import { useI18n } from "@/i18n";
import { FiBell, FiSearch, FiSettings, FiSidebar } from "solid-icons/fi";

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
      default:
        return [];
    }
  };

  createEffect(() => {
    getOs();
  });

  return (
    <div class="flex fixed top-0 left-0 flex-row w-screen h-[40px] z-50 cursor-default select-none border-b border-black/10">
      <div
        class="flex items-center justify-end w-1/5 h-full lg:max-w-[220px] min-w-[140px] shrink-0 px-2.5 lg:px-4 text-[#DFDFDF]"
        data-tauri-drag-region
      >
        <FiSidebar class="cursor-pointer" />
      </div>
      <div class="flex justify-between items-center px-3 w-4/5 h-full lg:px-6 lg:w-full" data-tauri-drag-region>
        <div class="flex gap-1 items-center h-full text-sm" data-tauri-drag-region>
          <For each={matchPathname(location.pathname)}>
            {(item, index) => (
              <Show
                when={index() === matchPathname(location.pathname).length - 1}
                fallback={
                  <>
                    <span class="text-gray-400" data-tauri-drag-region>
                      {item}
                    </span>
                    <span class="text-gray-400" data-tauri-drag-region>
                      /
                    </span>
                  </>
                }
              >
                <span class="text-black" data-tauri-drag-region>
                  {item}
                </span>
              </Show>
            )}
          </For>
        </div>
        <div class="flex flex-row gap-5 items-center py-1 h-full">
          {/* search bar */}
          <div class="flex justify-between items-center px-3 ml-16 w-60 h-full text-gray-500 bg-gray-200 rounded-lg lg:w-72">
            <div class="flex gap-2 items-center">
              <FiSearch /> Hledat
            </div>
          </div>
          <FiSettings />
          <FiBell />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
