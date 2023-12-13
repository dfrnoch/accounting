import { Accessor, For, ParentComponent } from "solid-js";

const LangaugeBox: ParentComponent<{ onClick: () => void; active?: boolean }> = (props) => {
  return (
    <div
      onclick={props.onClick}
      classList={{
        "py-4 text-3xl border text-primary border-neutral-900 rounded-md shadow-inner bg-neutral-900 px-10  transition cursor-pointer": true,
        "bg-pimary": props.active,
        "bg-secondary": !props.active,
      }}
    >
      {props.children}
    </div>
  );
};

export default LangaugeBox;
