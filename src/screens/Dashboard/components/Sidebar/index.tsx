import { type Component, For, type JSX } from "solid-js";
import SidebarButton from "./Button";
import SidebarSection from "./Section";
import { useI18n } from "@/i18n";
import {
  FiBriefcase,
  FiClipboard,
  FiDollarSign,
  FiFileMinus,
  FiFileText,
  FiHome,
  FiInbox,
  FiSettings,
  FiUsers,
} from "solid-icons/fi";
import { Hr } from "@/shared/components/Menu/Hr";
import { useNavigate } from "@solidjs/router";
import { useSelector } from "@/store";

interface SidebarButtonData {
  target: string;
  icon: JSX.Element;
  label: string;
}

interface SidebarSectionData {
  title: string;
  buttons: SidebarButtonData[];
}

const Sidebar: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const company = useSelector((state) => state.companyService.company);
  const stateService = useSelector((state) => state.stateService);

  const sidebarSections: SidebarSectionData[] = [
    {
      title: t("sidebar.section.sales"),
      buttons: [
        { target: "/dashboard/sales/invoices", icon: <FiFileText />, label: t("sidebar.button.invoices") },
        { target: "/dashboard/sales/received", icon: <FiFileMinus />, label: t("sidebar.button.receivedInvoices") },
        { target: "/dashboard/sales/proformas", icon: <FiInbox />, label: t("sidebar.button.proformas") },
      ],
    },
    {
      title: t("sidebar.section.other"),
      buttons: [
        { target: "/dashboard/other/clients", icon: <FiUsers />, label: t("sidebar.button.clients") },
        { target: "/dashboard/other/templates", icon: <FiClipboard />, label: t("sidebar.button.templates") },
        { target: "/dashboard/other/currencies", icon: <FiDollarSign />, label: t("sidebar.button.currencies") },
      ],
    },
  ];

  return (
    <div
      class="text-primary relative flex h-screen w-[200px] shrink-0 flex-col justify-between border-zinc-400/70 px-2.5 pb-4 lg:w-[220px] lg:px-4 dark:border-black/90"
      classList={{
        "pt-14 border-r bg-white/50 dark:bg-black/20": stateService.state.platform === "macos",
        "pt-2": stateService.state.platform !== "macos",
      }}
    >
      <div>
        <SidebarButton notInSection target="/dashboard" icon={<FiHome />}>
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
        {/* <Listbox value={selected()} onSelectChange={setSelected} defaultOpen={false}>  */}
        <div
          class="text-sm flex flex-row items-center justify-start gap-2.5 lg:gap-4 hover:bg-[#AFAEAF]/20 dark:hover:bg-neutral-100/15 bg-transparent rounded-[5px] px-2 py-[3px] w-full cursor-pointer"
          onClick={() => navigate("/login")}
        >
          <div class="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10 rounded-full bg-secondary opacity-50">
            <FiBriefcase class="w-5 h-5 text-primary" />
          </div>
          <span class="block truncate">{company.name}</span>
        </div>
        {/* <div class="flex flex-col w-full">
            <div class="relative"> */}
        {/* <DisclosureStateChild>
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
                      class="absolute bottom-full w-full py-1 mb-1 overflow-auto text-base bg-primary rounded-md shadow-menu max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <For each={companies()}>
                        {(company): JSX.Element => (
                          <ListboxOption
                            class="focus:outline-none group px-1"
                            value={company}
                            onClick={() => setCompany(company)}
                          >
                            {({ isActive, isSelected }): JSX.Element => (
                              <div
                                classList={{
                                  "text-primary bg-material-selection": isActive(),
                                  "text-opaque-1": !isActive(),
                                  "group-hover:text-primary group-hover:bg-material-selection": true,
                                  "cursor-default select-none relative py-2 pl-10 pr-4 rounded": true,
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
                                {isSelected() && (
                                  <span
                                    classList={{
                                      "text-primary": isActive(),
                                      "group-hover:text-primary": true,
                                      "absolute inset-y-0 left-0 flex items-center pl-3": true,
                                    }}
                                  >
                                    <FiCheck aria-hidden="true" />
                                  </span>
                                )}
                              </div>
                            )}
                          </ListboxOption>
                        )}
                      </For>
                      <ListboxOption
                        value={""}
                        class="focus:outline-none group px-1"
                        onClick={() => navigate("/setup")}
                      >
                        {({ isActive }): JSX.Element => (
                          <div
                            classList={{
                              "text-primary bg-material-selection": isActive(),
                              "text-opaque-1": !isActive(),
                              "group-hover:text-primary group-hover:bg-material-selection": true,
                              "cursor-default select-none relative py-2 pl-10 pr-4 rounded": true,
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
                            <span class="block truncate">{t("sidebar.button.company.create")}</span>
                          </div>
                        )}
                      </ListboxOption>
                    </ListboxOptions>
                  </Transition>
                )}
              </DisclosureStateChild> */}
        {/* </div>
          </div>
        </Listbox> */}
      </div>
    </div>
  );
};

export default Sidebar;
