import type { ParentComponent } from "solid-js";

const Box: ParentComponent<{ class?: string; chart?: boolean }> = (props) => {
  return (
    <div
      class={`rounded-lg border bg-element border-default h-full w-full ${props.class}`}
      classList={{
        "pb-2 pr-1": props.chart,
        "p-2.5": !props.chart,
      }}
    >
      {props.children}
    </div>
  );
};

export default Box;
