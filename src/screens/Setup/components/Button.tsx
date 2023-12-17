import { ParentComponent } from "solid-js";

export const Button: ParentComponent<{ onClick?: (e: MouseEvent) => void; class?: string }> = (props) => {
  return (
    <button
      class={`py-1.5 px-8 bg-primary rounded-md text-secondary font-medium text-sm ${props.class}`}
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
