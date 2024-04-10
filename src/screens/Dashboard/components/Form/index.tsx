import type { FormApi } from "@tanstack/solid-form";
import type { ParentComponent } from "solid-js";

// div beacuse form causes issues with dropdown menu
// biome-ignore lint/suspicious/noExplicitAny: idk what the form type is
const Form: ParentComponent<{ form: FormApi<any, undefined>; class?: string }> = (props) => {
  return <div class={`flex flex-col gap-8 ${props.class}`}>{props.children}</div>;
};
export default Form;
