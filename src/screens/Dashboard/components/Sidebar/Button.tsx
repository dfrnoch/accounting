import { A } from "@solidjs/router";
import type { JSX, ParentComponent } from "solid-js";

const SidebarButton: ParentComponent<{
  icon?: JSX.Element;
  notInSection?: boolean;
  target: string;
}> = (props) => {
  return (
    <A
      href={props.target}
      end
      class={`mt-1 flex items-center gap-[7px] rounded-[5px] px-2 py-[3px] text-primary text-sm transition-all hover:cursor-pointer hover:bg-[#AFAEAF]/20 dark:hover:bg-neutral-100/15 ${
        !props.notInSection ? "ml-2" : ""
      }`}
      activeClass="dark:bg-neutral-100/25 bg-[#AFAEAF]/70 hover:bg-[#AFAEAF]/70 dark:hover:bg-neutral-100/25"
    >
      {props.icon}
      {props.children}
    </A>
  );
};

export default SidebarButton;
