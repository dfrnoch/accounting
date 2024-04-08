import { type Component, Show } from "solid-js";
// import { Platform } from "@tauri-apps/plugin-os";

const StatBox: Component<{
  title: string;
  value: number;
  last?: number;
}> = (props) => {
  const percentageChange = (current: number, last?: number) => {
    if (!last) return 0;
    return (((current - last) / last) * 100).toFixed(2);
  };

  return (
    <div class="p-2.5 rounded-lg border bg-element border-default h-25 w-full relative overflow-hidden">
      <div class="absolute top-0 right-0 w-14 h-8 rounded-lg bg-green-500/30 blur-md" />
      <div class="flex flex-col justify-between items-stretch w-full h-full">
        <div class="flex flex-row justify-between items-start">
          <p class="text-xs font-medium">{props.title}</p>
          <div class="text-green-600 text-sm">{percentageChange(props.value, props.last)}%</div>
        </div>
        <div class="flex flex-col justify-between text-secondary gap-1">
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
