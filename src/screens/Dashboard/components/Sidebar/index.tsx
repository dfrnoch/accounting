import { Component } from "solid-js";
import SidebarButton from "./Button";
import SidebarSection from "./Section";
import { useSelector } from "@/store";
import { useI18n } from "@/i18n";
import {
  FiDollarSign,
  FiFileText,
  FiHome,
  FiPaperclip,
  FiSettings,
  FiUsers,
} from "solid-icons/fi";
import { Hr } from "@/shared/components/Menu/Hr";

const Sidebar: Component = () => {
  const [t] = useI18n();

  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="text-primary relative flex h-screen w-1/5 min-w-[140px] shrink-0 flex-col justify-between border-r border-zinc-400/70 px-2.5 pb-4 pt-14 lg:max-w-[220px] lg:px-4 dark:border-black/90">
      <div>
        <SidebarButton notInSection target="/dashboard/" icon={<FiHome />}>
          {t("sidebar.button.overview")}
        </SidebarButton>

        <SidebarSection title={t("sidebar.section.sales")}>
          <SidebarButton
            target="/dashboard/sales/invoices"
            icon={<FiFileText />}
          >
            {t("sidebar.button.invoices")}
          </SidebarButton>
        </SidebarSection>
        <SidebarSection title={t("sidebar.section.purchase")}>
          <SidebarButton
            target="/dashboard/purchase/expenses"
            icon={<FiDollarSign />}
          >
            {t("sidebar.button.expenses")}
          </SidebarButton>
        </SidebarSection>

        <SidebarSection title={t("sidebar.section.other")}>
          <SidebarButton target="/dashboard/other/clients" icon={<FiUsers />}>
            {t("sidebar.button.clients")}
          </SidebarButton>
          <SidebarButton
            target="/dashboard/other/reports"
            icon={<FiPaperclip />}
          >
            {t("sidebar.button.reports")}
          </SidebarButton>
        </SidebarSection>
      </div>

      {/* profile  */}
      <div class="flex flex-col gap-4">
        <SidebarButton
          target="/dashboard/settings"
          icon={<FiSettings />}
          notInSection
        >
          {t("sidebar.button.settings")}
        </SidebarButton>
        <Hr />
        <div class="flex flex-row items-center justify-start gap-2.5 lg:gap-4">
          <div class="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10">
            <img
              src="https://cdn.discordapp.com/avatars/724579978921902114/a0050fed75bf9ecbdc3dbcc23ecb6d8e.webp?size=2048"
              alt="pfp"
              class="rounded-full"
            />
          </div>
          <div class="flex flex-col">
            <span class="lg:text-md text-sm leading-3 lg:text-base lg:leading-5">
              {company.name}
            </span>
            <span class="text-grey text-sm">{company.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
