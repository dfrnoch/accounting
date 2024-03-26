import { onMount } from "solid-js";
import { type StoreSetter, createStore } from "solid-js/store";
// import { Store } from "@tauri-apps/plugin-store";

interface StateService {
  companyId: number | null;
  theme: "light" | "dark" | "auto";
}

const stateStore = createStore<StateService>({} as StateService);

export const StateService = () => {
  const [state, setState] = stateStore;

  onMount(() => {
    const stateString = localStorage.getItem("state");
    if (!stateString) return setState({ companyId: null, theme: "auto" });
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
