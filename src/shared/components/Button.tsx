import type { ParentComponent } from "solid-js";

type ButtonType = "danger" | "warning" | "success" | "default";

export const Button: ParentComponent<{ onClick?: (e: MouseEvent) => void; class?: string; type?: ButtonType }> = ({
  type = "default",
  ...props
}) => {
  return (
    <button
      class={
        "rounded py-0.5 px-2 text-sm shadow-md shadow-default/20 text-white max-w-30 bg-gradient-to-b from-transparent-white to-transparent active:from-transparent-black"
      }
      classList={{
        "bg-danger": type === "danger",
        "bg-warning": type === "warning",
        "bg-success": type === "success",
        "bg-default": type === "default",
      }}
      type="button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
