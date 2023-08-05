import { Component } from "solid-js";
import SidebarButton from "./Button";
import { useI18n } from "../../../i18n";
import SidebarSection from "./Section";

const Sidebar: Component = () => {
  const [t] = useI18n();

  return (
    <div class="w-1/5 max-w-220px bg-gray pt-10">
      {/* TODO: multiple buttons in sidebar */}
      <SidebarSection title="idk">cus</SidebarSection>
      <SidebarButton target="/">{t.sidebar_button_home()}</SidebarButton>
      <SidebarButton target="/invoices">{t.sidebar_button_invoices()}</SidebarButton>
    </div>
  );
};

export default Sidebar;
