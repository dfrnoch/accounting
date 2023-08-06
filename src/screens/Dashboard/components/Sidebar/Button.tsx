import { A } from "@solidjs/router";
import { ParentComponent } from "solid-js";

interface IMenuButtonProps {
  target: string;
}

const SidebarButton: ParentComponent<IMenuButtonProps> = (props) => {
  return (
    <A
      href={props.target}
      end={true}
      class="flex items-center justify-center bg-gray transition-all hover:bg-gray-100 gap-4 hover:cursor-pointer"
      activeClass="bg-gray-100"
    >
      {props.children}
    </A>
  );
};

export default SidebarButton;
