import type { FormApi } from "@tanstack/solid-form";
import type { ParentComponent } from "solid-js";

// TODO: View
// biome-ignore lint/suspicious/noExplicitAny: idk what the form type is
const Form: ParentComponent<{ form: FormApi<any, undefined> }> = (props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void props.form.handleSubmit();
      }}
    >
      {props.children}
    </form>
  );
};
export default Form;