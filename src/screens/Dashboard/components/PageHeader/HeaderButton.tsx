import type { ParentComponent } from "solid-js";

const HeaderButton: ParentComponent<{ buttonType?: "primary" | "secondary"; onClick?: (e: MouseEvent) => void }> = ({
  buttonType = "secondary",
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      classList={{
        "bg-black text-white dark:(bg-white text-black)": buttonType === "primary",
        "bg-secondary": buttonType === "secondary",
        "rounded h-full px-5 flex items-center justify-center text-sm text-primary": true,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default HeaderButton;
