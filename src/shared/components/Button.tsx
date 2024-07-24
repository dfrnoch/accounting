import type { ParentComponent } from "solid-js";

type ButtonType = "danger" | "warning" | "success" | "default";

export const Button: ParentComponent<{
  onClick?: (e: MouseEvent) => void;
  class?: string;
  type?: ButtonType;
  disabled?: boolean;
}> = ({ type = "default", disabled = false, ...props }) => {
  return (
    <button
      class={`
        rounded py-0.5 px-2 text-sm shadow-md shadow-default/20 text-white w-30
        bg-gradient-to-b from-transparent-white to-transparent
        active:from-transparent-black
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:from-transparent-white
      `}
      classList={{
        "bg-danger": type === "danger",
        "bg-warning text-black": type === "warning",
        "bg-success": type === "success",
        "bg-default": type === "default",
        [props.class ?? ""]: true,
      }}
      type="button"
      onClick={props.onClick}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
