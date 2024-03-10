import { createContext, createSignal, ParentComponent, useContext } from "solid-js";
import { CompanyService } from "./services/companyService";
import { StateService } from "./services/stateService";

export type RootState = {
  companyService: ReturnType<typeof CompanyService>;
  stateService: ReturnType<typeof StateService>;
};

const createRootState = (): RootState => {
  const [companyService] = createSignal(CompanyService());
  const [stateService] = createSignal(StateService());

  return {
    companyService: companyService(),
    stateService: stateService(),
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
