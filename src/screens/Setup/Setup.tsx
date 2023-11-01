import { useI18n } from "@/i18n";
import { createSignal, type Component, Show } from "solid-js";
import ProgressDots from "./components/Progress";
import { migrateAndPopulate } from "@/bindings";

const SetupWizard: Component = () => {
  const [t] = useI18n();
  const [currentStep, setCurrentStep] = createSignal(0);

  return (
    <div class="flex justify-center items-center w-screen h-screen bg-red">
      <div class="p-6 w-2/3 h-2/3 bg-secondary rounded-xl drop-shadow-xl flex items-center justify-center flex-col gap-8 relative">
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
          <h1 class="text-4xl font-bold text-primary">{t("setup.welcome")}</h1>
          <button class="py-2 px-4 bg-primary rounded-lg text-secondary font-medium" type="button">
            joe
          </button>
        </Show>
      </div>
    </div>
  );
};

export default SetupWizard;
