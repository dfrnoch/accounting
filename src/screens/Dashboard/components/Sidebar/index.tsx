import { Component, Show, createSignal } from "solid-js";
import SidebarButton from "./Button";
import SidebarSection from "./Section";
import ProfileButton from "./Profile/Button";
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
    <div class="w-1/5 lg:max-w-220px min-w-140px bg-gray pt-10 h-screen relative">
      {/* TODO: multiple buttons in sidebar */}
      <SidebarSection title="idk">cus</SidebarSection>
      <SidebarButton target="/">{t.sidebar_button_home()}</SidebarButton>
      <SidebarButton target="/invoices">{t.sidebar_button_invoices()}</SidebarButton>
      <SidebarButton target="/expenses">{t.sidebar_button_expenses()}</SidebarButton>
      <SidebarButton target="/clients">{t.sidebar_button_clients()}</SidebarButton>
      <SidebarButton target="/reports">{t.sidebar_button_reports()}</SidebarButton>

      {/* profile */}
      <div class="absolute bottom-5 w-full">
        <div class="rounded-xl border-t border-zinc-800/50 bg-zinc-900/80 p-2 backdrop-blur-md">
          <div class="flex items-center justify-between">
            <ProfileButton onClick={() => setCurrentPopover(PopoverList.Settings)}>
              <SettingsIcon />
            </ProfileButton>
            <ProfileButton onClick={() => setCurrentPopover(PopoverList.Profile)}>{company.name}</ProfileButton>
            <ProfileButton onClick={() => {}}>aa</ProfileButton>
          </div>
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
