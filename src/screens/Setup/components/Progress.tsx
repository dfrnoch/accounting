import { type Component, For } from "solid-js";

// https://macos-tailwind.netlify.app/?path=/docs/controls-progress-bar--docs
const ProgressDots: Component<{ count: number; active: number }> = (props) => {
  return (
    <div class="absolute w-full h-10 top-0 left-0 flex gap-4 items-center justify-center" data-tauri-drag-region>
      <For each={Array(props.count).fill(0)}>
        {(_, index) => (
          <div
            class={`transition rounded-full bg-black dark:bg-white ${
              props.active === index() ? "w-2.5 h-2.5 opacity-100 " : "opacity-30 w-2 h-2"
            }`}
          />
        )}
      </For>
    </div>
  );
};

export default ProgressDots;
