import { onMount } from "solid-js";
import { type StoreSetter, createStore } from "solid-js/store";
import { type Platform, platform } from "@tauri-apps/plugin-os";

export interface StateService {
  companyId: number;
  platform: Platform;
}

export const stateStore = createStore<StateService>({} as StateService);

export const StateService = () => {
  const [state, setState] = stateStore;

  onMount(async () => {
    const stateString = localStorage.getItem("state");

    if (!stateString) {
      setState({ companyId: 0, platform: platform() });
    } else {
      const parsedState = JSON.parse(stateString) as unknown as StateService;
      setState({ ...parsedState, platform: platform() });
    }
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
