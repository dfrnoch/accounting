import { type Component, For, type JSX, createSignal, onMount } from "solid-js";
import SidebarButton from "./Button";
import SidebarSection from "./Section";
import { useSelector } from "@/store";
import { useI18n } from "@/i18n";
import {
  FiCheck,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiPaperclip,
  FiPlus,
  FiSave,
  FiSettings,
  FiUsers,
} from "solid-icons/fi";
import { Hr } from "@/shared/components/Menu/Hr";
import { DisclosureStateChild, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "terracotta";
import { type Company, getCompanies } from "@/bindings";

const Sidebar: Component = () => {
  const [t] = useI18n();
  const company = useSelector((state) => state.companyService.company);
  const [companies, setCompanies] = createSignal<Company[]>([company]);

  onMount(async () => {
    const data = await getCompanies(company.id);
    setCompanies((prev) => [...prev, ...data]);
  });

  const [selected, setSelected] = createSignal(companies()[0]);

  const sidebarSections = [
    {
      title: t("sidebar.section.sales"),
      buttons: [
        { target: "/dashboard/sales/invoices", icon: <FiFileText />, label: t("sidebar.button.invoices") },
        { target: "/dashboard/sales/templates", icon: <FiSave />, label: t("sidebar.button.templates") },
        { target: "/dashboard/sales/schedules", icon: <FiClock />, label: t("sidebar.button.schedules") },
      ],
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
    <div class="text-primary relative flex h-screen w-1/5 min-w-[200px] shrink-0 flex-col justify-between border-r border-zinc-400/70 px-2.5 pb-4 pt-14 lg:max-w-[220px] lg:px-4 dark:border-black/90">
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
        <Listbox defaultOpen={false} value={selected()} onSelectChange={setSelected}>
          <ListboxButton class="text-sm flex flex-row items-center justify-start gap-2.5 lg:gap-4 hover:bg-neutral-100/40 dark:hover:bg-neutral-100/25 bg-transparent rounded-[5px] px-2 py-[3px] w-full">
            <div class="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10 rounded-full">
              <img
                src="https://wallpapers-clan.com/wp-content/uploads/2023/05/cool-anime-pfp-2-17.jpg"
                alt="pfp"
                class="rounded-full"
              />
            </div>
            <span
              class="block truncate"
              onClick={() => {
                console.log(companies());
              }}
            >
              {company.name}
            </span>
          </ListboxButton>
          <div class="flex flex-col w-full">
            <div class="relative">
              <DisclosureStateChild>
                {({ isOpen }): JSX.Element => (
                  <Transition
                    show={isOpen()}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <ListboxOptions
                      unmount={false}
                      class="absolute bottom-full w-full py-1 mb-1 overflow-auto text-base bg-secondary rounded-md shadow-menu max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <For each={companies()}>
                        {(company): JSX.Element => (
                          <ListboxOption class="focus:outline-none group" value={company}>
                            {({ isActive, isSelected }): JSX.Element => (
                              <div
                                classList={{
                                  "text-primary bg-material-selection": isActive(),
                                  "text-opaque-1": !isActive(),
                                  "group-hover:text-primary group-hover:bg-material-selection": true,
                                  "cursor-default select-none relative py-2 pl-10 pr-4": true,
                                }}
                              >
                                <span
                                  classList={{
                                    "font-bold": isSelected(),
                                    "font-normal": !isSelected(),
                                    "block truncate": true,
                                  }}
                                >
                                  {company.name}
                                </span>
                                {isSelected() ? (
                                  <span
                                    classList={{
                                      "text-primary": isActive(),
                                      "group-hover:text-primary": true,
                                      "absolute inset-y-0 left-0 flex items-center pl-3": true,
                                    }}
                                  >
                                    <FiCheck aria-hidden="true" />
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </ListboxOption>
                        )}
                      </For>
                      {/* Option to create company */}
                      <ListboxOption
                        value={""}
                        class="focus:outline-none group"
                        onclick={() => console.log("create company")}
                      >
                        {({ isActive, isSelected }): JSX.Element => (
                          <div
                            classList={{
                              "text-primary bg-material-selection": isActive(),
                              "text-opaque-1": !isActive(),
                              "group-hover:text-primary group-hover:bg-material-selection": true,
                              "cursor-default select-none relative py-2 pl-10 pr-4": true,
                            }}
                          >
                            <span
                              classList={{
                                "text-primary": isActive(),
                                "group-hover:text-primary": true,
                                "absolute inset-y-0 left-0 flex items-center pl-3": true,
                              }}
                            >
                              <FiPlus />
                            </span>
                            <span
                              classList={{
                                "font-medium": isSelected(),
                                "font-normal": !isSelected(),
                                "block truncate": true,
                              }}
                            >
                              {t("sidebar.button.company.create")}
                            </span>
                          </div>
                        )}
                      </ListboxOption>
                    </ListboxOptions>
                  </Transition>
                )}
              </DisclosureStateChild>
            </div>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default Sidebar;
