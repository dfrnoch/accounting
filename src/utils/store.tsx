import { createContext, ParentComponent, useContext } from "solid-js";
import { CompanyService } from "../services/companyService";
import { StateService } from "../services/stateService";

export type RootState = {
  companyService: ReturnType<typeof CompanyService>;
  stateService: ReturnType<typeof StateService>;
};

const rootState: RootState = {
  companyService: CompanyService(),
  stateService: StateService(),
};

const StoreContext = createContext<RootState>({} as RootState);

export const useSelector = () => useContext(StoreContext);

export const StoreProvider: ParentComponent = (props) => {
  return <StoreContext.Provider value={rootState}>{props.children}</StoreContext.Provider>;
};
