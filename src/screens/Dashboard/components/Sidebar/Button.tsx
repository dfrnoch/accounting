import { A } from "@solidjs/router";
import { ParentComponent } from "solid-js";

const SidebarButton: ParentComponent<{
  target: string;
}> = (props) => {
  return (
    <A
      href={props.target}
      end={true}
      class="flex gap-4 items-center px-2 ml-2 rounded-md transition-all bg-gray hover:bg-gray-100 hover:cursor-pointer"
      activeClass="bg-gray-100"
    >
      {props.children}
    </A>
  );
};

export default SidebarButton;
