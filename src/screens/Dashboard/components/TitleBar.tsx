import { Component, Show, createEffect, createSignal } from "solid-js";
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
        return t.sidebar_button_home();
      case "/invoices":
        return t.sidebar_button_invoices();
      case "/expenses":
        return t.sidebar_button_expenses();
      case "/clients":
        return t.sidebar_button_clients();
      case "/reports":
        return t.sidebar_button_reports();
      default:
        return "idk";
    }
  };

  createEffect(() => {
    getOs();
  });

  return (
    <div class="fixed top-0 left-0 w-screen h-30px lg:h-35px z-98 flex flex-row">
      <div class="flex items-center w-1/5 bg-green h-full lg:max-w-220px min-w-140px" data-tauri-drag-region />
      <div class="flex items-center w-4/5 xl:w-full bg-yellow h-full" data-tauri-drag-region>
        {matchPathname(location.pathname)}
      </div>
    </div>
  );
};

export default TitleBar;
