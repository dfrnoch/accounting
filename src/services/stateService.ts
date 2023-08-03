import { onMount } from "solid-js";
import { StoreSetter, createStore } from "solid-js/store";

interface StateService {
  companyId: number | null;
  currentMenu: string;
}

const stateStore = createStore<StateService>({} as StateService);

export const StateService = () => {
  const [state, setState] = stateStore;

  onMount(() => {
    const stateString = localStorage.getItem("state");
    if (!stateString) return setState({ companyId: null, currentMenu: "home" });
    setState(() => JSON.parse(stateString) as unknown as StateService);
  });

  const updateState = (value: StoreSetter<StateService>) => {
    setState((prevState) => {
      const newState = typeof value === "function" ? value(prevState, []) : value;
      return newState;
    });

    localStorage.setItem("state", JSON.stringify(state));
  };

  return { state, updateState };
};
