import { Component, createEffect, createSignal } from "solid-js";
import { platform } from "@tauri-apps/api/os";

const TitleBar: Component = () => {
  const [os, setOs] = createSignal<string>("");

  const getOs = async () => {
    const osPlatform = await platform();
    setOs(osPlatform);
  };

  createEffect(() => {
    getOs();
  });

  return <div class="fixed top-0 left-0 w-screen h-26px z-98 bg-red" data-tauri-drag-region />;
};

export default TitleBar;
