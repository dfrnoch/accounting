import { Show, type ParentComponent } from "solid-js";
import { I18nProvider, locale } from "@/i18n";
import { Toaster } from "solid-toast";
import { StoreProvider } from "@/store";

const App: ParentComponent = (props) => {
  return (
    <I18nProvider locale={locale()}>
      {/* When in developement enviroment show text */}
      <Show when={import.meta.env.DEV}>
        <div class="absolute bottom-0 right-0 p-2 text-danger text-xs font-medium">Developement enviroment</div>
      </Show>
      <StoreProvider>{props.children}</StoreProvider>
      <Toaster />
    </I18nProvider>
  );
};

export default App;
