import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { Platform, platform } from "@tauri-apps/plugin-os";
import { useLocation } from "@solidjs/router";
import { useI18n } from "@/i18n";

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
    <div class="flex fixed top-0 left-0 flex-row w-screen h-30px z-98">
      <div class="flex items-center w-1/5 h-full bg-green lg:max-w-220px min-w-140px shrink-0" data-tauri-drag-region />
      <div class="flex items-center w-4/5 h-full lg:w-full bg-yellow" data-tauri-drag-region>
        <div class="flex gap-2 items-center h-full">
          <For each={matchPathname(location.pathname)}>
            {(item, index) => (
              <Show
                when={index() === matchPathname(location.pathname).length - 1}
                fallback={
                  <>
                    <span class="font-bold text-gray-400 text-md">{item}</span>
                    <span class="font-bold text-gray-400 text-md">/</span>
                  </>
                }
              >
                <span class="font-bold text-black text-md">{item}</span>
              </Show>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
