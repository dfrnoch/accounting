import { Component, JSX } from "solid-js";

const Toolbar: Component<{
  text: string;
  icon?: JSX.Element;
  active?: boolean;
  onClick?: () => void;
}> = (props) => {
  return (
    <div
      class="p-2 hover:bg-gray-100/5 rounded-lg flex flex-col gap-1 items-center font-medium transition cursor-pointer text-sm"
      classList={{ "bg-gray-100/5": props.active }}
      onClick={props.onClick}
    >
      {props.icon}
      {props.text}
    </div>
  );
};

export default Toolbar;
