import { Component } from "solid-js";
import SidebarButton from "./Button";
import { useI18n } from "../../../../i18n";
import SidebarSection from "./Section";
import { useSelector } from "../../../../utils/store";
import SettingsIcon from "../../../../shared/icons/Settings";
import ProfileButton from "./Profile/Button";

const Sidebar: Component = () => {
  const [t] = useI18n();

  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="w-1/5 lg:max-w-220px min-w-140px bg-gray pt-10 h-screen relative">
      {/* TODO: multiple buttons in sidebar */}
      <SidebarSection title="idk">cus</SidebarSection>
      <SidebarButton target="/">{t.sidebar_button_home()}</SidebarButton>
      <SidebarButton target="/invoices">{t.sidebar_button_invoices()}</SidebarButton>

      {/* profile */}
      <div class="absolute bottom-5 w-full">
        <div class="rounded-xl border-t border-zinc-800/50 bg-zinc-900/80 p-2 backdrop-blur-md">
          <div class="flex items-center justify-between">
            <ProfileButton>
              <SettingsIcon />
            </ProfileButton>
            <ProfileButton>{company.name}</ProfileButton>
            <ProfileButton>aa</ProfileButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
