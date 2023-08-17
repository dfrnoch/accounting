import { A } from "@solidjs/router";
import { JSX, ParentComponent } from "solid-js";

const SidebarButton: ParentComponent<{
  icon?: JSX.Element;
  notInSection?: boolean;
  target: string;
}> = (props) => {
  return (
    <A
      href={props.target}
      end={true}
      class={`flex text-gray-600 gap-1.5 items-center px-2 py-0.5 mt-1 rounded-md transition-all bg-gray hover:bg-gray-100 hover:cursor-pointer ${
        !props.notInSection ? "ml-2" : ""
      }`}
      activeClass="bg-gray-100"
    >
      {props.icon}
      {props.children}
    </A>
  );
};

export default SidebarButton;
