import { ParentComponent } from "solid-js";

interface ISidebarSectionProps {
  title: string;
}

const SidebarSection: ParentComponent<ISidebarSectionProps> = (props) => {
  return <div>{props.children}</div>;
};

export default SidebarSection;
