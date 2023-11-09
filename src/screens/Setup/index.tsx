import { useI18n } from "@/i18n";
import { createSignal, type Component, Show } from "solid-js";
import ProgressDots from "./components/Progress";
import { migrateAndPopulate } from "@/bindings";
import Input from "@/shared/components/Input";

const SetupWizard: Component = () => {
  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(0);

  return (
    <div class="flex justify-center items-center w-screen h-screen bg-red" data-tauri-drag-region>
      <div class="px-8 py-6 w-2/3 h-2/3 bg-secondary rounded-xl drop-shadow-xl flex items-center justify-center flex-col gap-8 relative">
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
          <h1 class="text-4xl font-bold text-primary">{t("setup.step1.create_company")}</h1>
          <div class="grid grid-cols-3 grid-rows-3 gap-3 mx-24">
            <Input id="companme" label={"cus"} class="col-span-2" />
            <Input id="companame" label={"Tvoje email adress"} />
            <Input id="company_name" label={"Tvoje jemno"} />
          </div>
          <button class="py-2 px-4 bg-primary rounded-lg text-secondary font-medium" type="button">
            pokra4ovat
          </button>
        </Show>
      </div>
    </div>
  );
};

export default SetupWizard;
