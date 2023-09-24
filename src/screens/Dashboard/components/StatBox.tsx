import { Component, createSignal } from "solid-js";
import { Platform } from "@tauri-apps/plugin-os";

const StatBox: Component<{
  title: string;
  value: string;
}> = (props) => {
  const [os, setOs] = createSignal<Platform | null>(null);

  return (
    <div class="flex flex-col justify-between text-grey">
      <p class="text-md">{props.title}</p>
      <p class="text-2xl font-medium text-primary">{props.value}</p>
      <div class="text-green-200">30%</div>
    </div>
  );
};

export default StatBox;
