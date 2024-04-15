import { createContext, createSignal, type ParentComponent, useContext } from "solid-js";
import { CompanyService } from "./services/CompanyService";
import { SettingsService } from "./services/SettingsService";
import { StateService } from "./services/stateService";

export type RootState = {
  companyService: ReturnType<typeof CompanyService>;
  settingsService: ReturnType<typeof SettingsService>;
  stateService: ReturnType<typeof StateService>;
};

const createRootState = (): RootState => {
  const [companyService] = createSignal(CompanyService());
  const [settingsService] = createSignal(SettingsService());
  const [stateService] = createSignal(StateService());

  return {
    companyService: companyService(),
    stateService: stateService(),
    settingsService: settingsService(),
  };
};

const StoreContext = createContext<RootState>();

export const useSelector = <T,>(selector: (state: RootState) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useSelector must be used within a StoreProvider");
  }
  return selector(store);
};

export const StoreProvider: ParentComponent = (props) => {
  const store = createRootState();

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
};
