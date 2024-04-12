import type { ParentComponent } from "solid-js";

export const Button: ParentComponent<{ onClick?: (e: MouseEvent) => void; class?: string }> = (props) => {
  return (
    <button
      class={
        "rounded py-0.5 px-2 text-sm shadow-md shadow-default/20 text-white bg-default  bg-gradient-to-b from-transparent-white to-transparent active:from-transparent-black"
      }
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
