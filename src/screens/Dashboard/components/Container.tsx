import type { ParentComponent } from "solid-js";

const Container: ParentComponent<{ class?: string }> = (props) => {
  return <div class={`pt-10px px-4 w-full h-full ${props.class}`}>{props.children}</div>;
};

export default Container;
