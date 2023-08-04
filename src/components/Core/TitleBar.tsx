import { Component, Show, createEffect, createSignal } from "solid-js";
import { Platform, platform } from "@tauri-apps/plugin-os";

const TitleBar: Component = () => {
  const [os, setOs] = createSignal<Platform | null>(null);

  const getOs = async () => {
    const osPlatform = await platform();
    setOs(osPlatform);
    console.log(osPlatform);
  };

  createEffect(() => {
    getOs();
  });

  return (
    <>
      <Show when={os() === "macos"}>
        <div class="fixed top-0 left-0 w-screen h-28px z-98 bg-red" data-tauri-drag-region />
      </Show>
    </>
  );
};

export default TitleBar;
