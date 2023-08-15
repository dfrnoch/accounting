import { Component, Show, createSignal } from "solid-js";
import SidebarButton from "./Button";
import SidebarSection from "./Section";
import { useSelector } from "@/store";
import { useI18n } from "@/i18n";
import SettingsIcon from "@/shared/icons/Settings";
import Popover from "@/shared/components/Popover";
//@ts-expect-error
import { Presence } from "@motionone/solid";

enum PopoverList {
  Profile = "profile",
  Settings = "settings",
}

const Sidebar: Component = () => {
  const [t] = useI18n();
  const [currentPopover, setCurrentPopover] = createSignal<PopoverList | null>(null);

  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="w-1/5 lg:max-w-220px min-w-140px bg-gray pt-10 pb-4 px-4 h-screen relative shrink-0 flex flex-col justify-between">
      <div>
        <SidebarButton target="/">{t.sidebar_button_overview()}</SidebarButton>

        <SidebarSection title={t.sidebar_section_sales()}>
          <SidebarButton target="sales/invoices">{t.sidebar_button_invoices()}</SidebarButton>
        </SidebarSection>
        <SidebarSection title={t.sidebar_section_purchase()}>
          <SidebarButton target="/purchase/expenses">{t.sidebar_button_expenses()}</SidebarButton>
        </SidebarSection>

        <SidebarSection title={t.sidebar_section_directory()}>
          <SidebarButton target="/directory/clients">{t.sidebar_button_clients()}</SidebarButton>
        </SidebarSection>
      </div>

      {/* profile */}
      <div class="flex flex-row justify-start gap-3 items-center">
        <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <SettingsIcon />
        </div>
        <div class="flex flex-col leading-4">
          <span class="text">{company.name}</span>
          <span class="text-gray-700 text-sm">{company.email}</span>
        </div>
      </div>

      <Presence exitBeforeEnter>
        <Show when={currentPopover() === PopoverList.Profile}>
          <Popover onClose={() => setCurrentPopover(null)} title="Profile">
            Cus
          </Popover>
        </Show>
        <Show when={currentPopover() === PopoverList.Settings}>
          <Popover onClose={() => setCurrentPopover(null)} title="Settings">
            Nastaveni
          </Popover>
        </Show>
      </Presence>
    </div>
  );
};

export default Sidebar;
