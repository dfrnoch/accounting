import { Component, JSX } from "solid-js";

const Toolbar: Component<{
  text: string;
  icon?: JSX.Element;
  active?: boolean;
}> = (props) => {
  return (
    <div
      class="p-2 hover:bg-gray-100/5 rounded-lg flex flex-col gap-1 items-center font-medium transition cursor-pointer"
      classList={{ "bg-gray-100/5": props.active }}
    >
      {props.icon}
      {props.text}
    </div>
  );
};

export default Toolbar;
