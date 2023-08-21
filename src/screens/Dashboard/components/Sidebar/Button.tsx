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
      class={`text-sm flex gap-[7px] items-center px-2 py-[3px] mt-1 rounded-[5px] transition-all  dark:hover:bg-neutral-100/25  hover:bg-neutral-100/40 hover:cursor-pointer ${
        !props.notInSection ? "ml-2" : ""
      }`}
      activeClass="dark:bg-neutral-100/15 bg-neutral-100/25"
    >
      {props.icon}
      {props.children}
    </A>
  );
};

export default SidebarButton;
