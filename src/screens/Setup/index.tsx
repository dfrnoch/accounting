import { locale, setLocale, useI18n } from "@/i18n";
import { createSignal, type Component, Show } from "solid-js";
import ProgressDots from "./components/Progress";
import { migrateAndPopulate } from "@/bindings";
import Input from "@/shared/components/Input";
import { createStore } from "solid-js/store";
import LangaugeBox from "./components/LanguageBox";
import { LANG } from "@/constants";
import { open } from "@tauri-apps/plugin-shell";

const SetupWizard: Component = () => {
  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(0);
  const [userData, setUserData] = createStore({
    companyName: "",
    companyEmail: "",
    userName: "",
    userEmail: "",
  });

  return (
    <div class="flex justify-center items-center w-screen h-screen" data-tauri-drag-region>
      <div class="px-8 py-6 w-3/4 h-5/7 bg-secondary rounded-xl drop-shadow-xl flex items-center justify-center flex-col gap-8 relative">
        <ProgressDots count={5} active={currentStep()} />
        <Show when={currentStep() === 0}>
          <h1 class="text-4xl font-bold text-primary">{t("setup.welcome")}</h1>
          <button
            class="py-2 px-4 bg-primary rounded-lg text-secondary font-medium"
            type="button"
            onClick={() => {
              setCurrentStep(1);
              migrateAndPopulate();
            }}
          >
            {t("setup.get_started")}
          </button>
        </Show>

        <Show when={currentStep() === 1}>
          <h1 class="text-4xl font-bold text-primary">{t("setup.step1.select_language")}</h1>
          <div>
            <div class="flex gap-4">
              <LangaugeBox onClick={() => setLocale(LANG.CS)} active={locale() === LANG.CS}>
                🇨🇿
              </LangaugeBox>
              <LangaugeBox onClick={() => setLocale(LANG.EN)} active={locale() === LANG.EN}>
                🇬🇧
              </LangaugeBox>
            </div>
            <p
              class="text-primary underline"
              onClick={() => {
                open("https://github.com");
              }}
            >
              {t("setup.step1.improve")}
            </p>
          </div>
          <button
            class="py-2 px-4 bg-primary rounded-lg text-secondary font-medium"
            type="button"
            onClick={() => setCurrentStep(2)}
          >
            {t("setup.continue")}
          </button>
        </Show>

        <Show when={currentStep() === 2}>
          <h1 class="text-4xl font-bold text-primary">{t("setup.step2.create_company")}</h1>
          <div class="flex gap-4 w-full justify-around h-50">
            <div class="w-30 flex flex-col items-center justify-center ">
              <h2 class="text-2xl font-bold text-primary">Automaticke</h2>
              <Input
                id="CIN"
                // label={t("setup.step2.CIN")}
                class="col-span-2"
                onChange={(e) => setUserData("companyEmail", e.target?.value)}
              />
            </div>
            <div class="flex flex-row justify-center items-center gap-3">
              <div class="w-1px h-full bg-red" />
            </div>
            <div class="w-30 flex items-center justify-center">
              <h2 class="text-2xl font-bold text-primary">Manualne</h2>
              <button class="py-2 px-4 bg-primary rounded-lg text-secondary font-medium" type="button">
                Manualne
              </button>
            </div>
          </div>
          {/* <div class="grid grid-cols-5 grid-rows-3 gap-3 mx-15">
            <Input
              id="companme"
              label={t("setup.step2.company_name")}
              class="col-span-3"
              onChange={(e) => setUserData("companyName", e.target?.value)}
            />
            <Input
              id="CIN"
              label={t("setup.step2.CIN")}
              class="col-span-2"
              onChange={(e) => setUserData("companyEmail", e.target?.value)}
            />
            <Input
              id="user_lave"
              label="Tvoje jemno"
              class="col-span-2"
              onChange={(e) => setUserData("userName", e.target?.value)}
            />
          </div> */}
          {/* <button class="py-2 px-4 bg-primary rounded-lg text-secondary font-medium" type="button">
            {t("setup.continue")}
          </button> */}
        </Show>
      </div>
    </div>
  );
};

export default SetupWizard;
