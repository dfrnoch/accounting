import type { ParentComponent } from "solid-js";

interface ISidebarSectionProps {
  title: string;
}

const SidebarSection: ParentComponent<ISidebarSectionProps> = (props) => {
  return (
    <>
      <div class="mt-4 text-xs font-medium text-secondary">{props.title}</div>
      <div class="">{props.children}</div>
    </>
  );
};

export default SidebarSection;
