import { Component, For } from "solid-js";
import SidebarButton from "./Button";
import SidebarSection from "./Section";
import { useSelector } from "@/store";
import { useI18n } from "@/i18n";
import { FiDollarSign, FiFileText, FiHome, FiPaperclip, FiSettings, FiUsers } from "solid-icons/fi";
import { Hr } from "@/shared/components/Menu/Hr";

const Sidebar: Component = () => {
  const [t] = useI18n();
  const company = useSelector((state) => state.companyService.company);

  const sidebarSections = [
    {
      title: t("sidebar.section.sales"),
      buttons: [{ target: "/dashboard/sales/invoices", icon: <FiFileText />, label: t("sidebar.button.invoices") }],
    },
    {
      title: t("sidebar.section.purchase"),
      buttons: [
        { target: "/dashboard/purchase/expenses", icon: <FiDollarSign />, label: t("sidebar.button.expenses") },
      ],
    },
    {
      title: t("sidebar.section.other"),
      buttons: [
        { target: "/dashboard/other/clients", icon: <FiUsers />, label: t("sidebar.button.clients") },
        { target: "/dashboard/other/reports", icon: <FiPaperclip />, label: t("sidebar.button.reports") },
      ],
    },
  ];

  return (
    <div class="text-primary relative flex h-screen w-1/5 min-w-[140px] shrink-0 flex-col justify-between border-r border-zinc-400/70 px-2.5 pb-4 pt-14 lg:max-w-[220px] lg:px-4 dark:border-black/90">
      <div>
        <SidebarButton notInSection target="/dashboard/" icon={<FiHome />}>
          {t("sidebar.button.overview")}
        </SidebarButton>

        <For each={sidebarSections}>
          {(section) => (
            <SidebarSection title={section.title}>
              <For each={section.buttons}>
                {(button) => (
                  <SidebarButton target={button.target} icon={button.icon}>
                    {button.label}
                  </SidebarButton>
                )}
              </For>
            </SidebarSection>
          )}
        </For>
      </div>

      <div class="flex flex-col gap-4">
        <SidebarButton target="/dashboard/settings" icon={<FiSettings />} notInSection>
          {t("sidebar.button.settings")}
        </SidebarButton>
        <Hr />
        <div class="flex flex-row items-center justify-start gap-2.5 lg:gap-4">
          <div class="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10 rounded-full">
            <img
              src="https://wallpapers-clan.com/wp-content/uploads/2023/05/cool-anime-pfp-2-17.jpg"
              alt="pfp"
              class="rounded-full!"
            />
          </div>
          <div class="flex flex-col">
            <span class="lg:text-md text-sm leading-3 lg:text-base lg:leading-5">{company.name}</span>
            <span class="text-grey text-sm">{company.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
