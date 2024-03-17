import { Component, For } from "solid-js";

// https://macos-tailwind.netlify.app/?path=/docs/controls-progress-bar--docs
const ProgressDots: Component<{ count: number; active: number }> = (props) => {
  return (
    // add blur and
    <div class="absolute w-full h-10 top-0 left-0 flex gap-4 items-center justify-center">
      {/* <div class="bg-black/20  flex flex-row"> */}
      <For each={Array(props.count).fill(0)}>
        {(_, index) => (
          <div
            class={`w-2 h-2 bg-primary opacity-80 transition rounded-full ${
              props.active === index() ? "bg-red opacity-100 " : ""
            }`}
          />
        )}
      </For>
      {/* </div> */}
    </div>
  );
};

export default ProgressDots;
