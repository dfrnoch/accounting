import type { Component } from "solid-js";
import { I18nProvider, locale } from "@/i18n";
import { Toaster } from "solid-toast";
import { Show, createEffect, createSignal, lazy } from "solid-js";
import { checkDb } from "@/bindings";
import { StoreProvider } from "@/store";

const Dashboard = lazy(() => import("./screens/Dashboard"));
const SetupWizard = lazy(() => import("./screens/Setup"));

enum Screen {
  Dashboard = "dashboard",
  Setup = "setup",
  Loading = "loading",
}

const App: Component = () => {
  const [screen, setScreen] = createSignal<Screen>(Screen.Loading);

  const startup = async () => {
    const data = await checkDb();

    if (data === 200) {
      return setScreen(Screen.Dashboard);
    }
    return setScreen(Screen.Setup);
  };

  createEffect(() => {
    startup();
  });

  return (
    <I18nProvider locale={locale()}>
      <Show when={screen() === Screen.Dashboard}>
        <StoreProvider>
          <Dashboard />
        </StoreProvider>
      </Show>
      <Show when={screen() === Screen.Setup}>
        <SetupWizard />
      </Show>
      <Show when={screen() === Screen.Loading}>
        <div class="flex justify-center items-center h-screen">
          <div class="flex flex-col justify-center items-center">
            <h1 class="text-4xl font-bold">Loading...</h1>
          </div>
        </div>
      </Show>
      <Toaster />
    </I18nProvider>
  );
};

export default App;
