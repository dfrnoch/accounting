import type { Component } from "solid-js";

export const Hr: Component<{ class?: string }> = (props) => {
  return <hr class={`w-full border-default opacity-30 ${props.class}`} />;
};
