import type { ParentComponent } from "solid-js";

// div beacuse form causes issues with dropdown menu
const Form: ParentComponent<{ class?: string }> = (props) => {
  return <div class={`w-full flex flex-col gap-8 ${props.class}`}>{props.children}</div>;
};
export default Form;
