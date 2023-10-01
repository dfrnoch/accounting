import { Component, Show, createSignal } from "solid-js";
import { Platform } from "@tauri-apps/plugin-os";

const StatBox: Component<{
  title: string;
  value: string;
  last?: number;
}> = (props) => {
  const [os, setOs] = createSignal<Platform | null>(null);

  return (
    <div class="p-2.5 rounded-lg border bg-[#E6E6E6] border-[#dddddd] dark:bg-[#282828] dark:border-neutral-600 h-full w-full relative overflow-hidden">
      {/* blurred green at top right */}
      <div class="absolute top-0 right-0 w-14 h-8 rounded-lg bg-green-500/30 blur-md" />
      <div class="flex flex-col justify-between items-stretch w-full h-full">
        <div class="flex flex-row justify-between items-start">
          <p class="text-xs font-medium">{props.title}</p>
          <div class="text-green-600 text-sm">+30%</div>
        </div>
        <div class="flex flex-col justify-between text-grey border border-secondary gap-1">
          <p class="text-xl font-medium text-primary">{props.value}</p>
          <Show when={props.last}>
            <p class="text-xs font-normal">${props.last} Previous period</p>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default StatBox;
