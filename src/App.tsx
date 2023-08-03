import type { Component } from "solid-js";
import { I18nProvider } from "./i18n";
import { Toaster } from "solid-toast";
import { Show, createEffect, createSignal, lazy } from "solid-js";
import { checkDb } from "./bindings";
import { StoreProvider } from "./utils/store";
import TitleBar from "./components/Core/TitleBar";
const Dashboard = lazy(() => import("./screens/Dashboard"));
const SetupWizard = lazy(() => import("./screens/SetupWizard"));

enum Screen {
  Dashboard = "dashboard",
  Setup = "setup",
  Loading = "loading",
}

const App: Component = () => {
  const [screen, setScreen] = createSignal<Screen>(Screen.Loading);

  const checkSetup = async () => {
    const data = await checkDb();
    if (data) {
      return setScreen(Screen.Dashboard);
    }
    return setScreen(Screen.Setup);
  };

  createEffect(() => {
    checkSetup();
  });

  return (
    <I18nProvider>
      <TitleBar />
      <Show when={screen() === Screen.Dashboard}>
        <StoreProvider>
          <Dashboard />
        </StoreProvider>
      </Show>
      <Show when={screen() === Screen.Setup}>
        <SetupWizard />
      </Show>
      <Show when={screen() === Screen.Loading}>
        <div class="flex items-center justify-center h-screen">
          <div class="flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold text-red">Loading...</h1>
          </div>
        </div>
      </Show>
      <Toaster />
    </I18nProvider>
  );
};

export default App;
