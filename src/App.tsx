import type { ParentComponent } from "solid-js";
import { I18nProvider, locale } from "@/i18n";
import { Toaster } from "solid-toast";
import { StoreProvider } from "@/store";

const App: ParentComponent = (props) => {
  return (
    <I18nProvider locale={locale()}>
      <StoreProvider>{props.children}</StoreProvider>
      <Toaster gutter={8} position="bottom-right" />
    </I18nProvider>
  );
};

export default App;
