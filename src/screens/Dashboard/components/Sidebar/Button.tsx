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
      class={`text-sm flex gap-[7px] items-center px-2 py-[3px] mt-1 rounded-[5px] transition-all bg-gray hover:bg-gray-100/30 hover:cursor-pointer ${
        !props.notInSection ? "ml-2" : ""
      }`}
      activeClass="bg-gray-100/20"
    >
      {props.icon}
      {props.children}
    </A>
  );
};

export default SidebarButton;
