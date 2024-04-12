import type { ParentComponent } from "solid-js";

export const Title: ParentComponent<{ class?: string }> = (props) => {
  return <h1 class={`text-2xl font-semibold text-primary ${props.class}`}>{props.children}</h1>;
};
