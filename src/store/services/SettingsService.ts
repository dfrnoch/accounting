import { getSettings, type Settings } from "@/bindings";
import { createStore } from "solid-js/store";

const settingsStore = createStore<Settings>({} as Settings);

export const SettingsService = () => {
  const [settings, setSettings] = settingsStore;

  const updateSettings = async () => {
    setSettings(await getSettings());
  };

  return { settings, updateSettings };
};
