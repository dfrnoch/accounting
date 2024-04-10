import type { ParentComponent } from "solid-js";

const Box: ParentComponent<{ class?: string }> = (props) => {
  return (
    <div class={`rounded-lg border p-3 bg-element border-default h-full w-full ${props.class}`}>{props.children}</div>
  );
};

export default Box;
