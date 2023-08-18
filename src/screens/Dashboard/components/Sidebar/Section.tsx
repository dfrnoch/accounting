import { ParentComponent } from "solid-js";

interface ISidebarSectionProps {
  title: string;
}

const SidebarSection: ParentComponent<ISidebarSectionProps> = (props) => {
  return (
    <div class="mt-5 cursor-default select-none">
      <div class="text-xs font-medium text-white/50">{props.title}</div>
      <div class="">{props.children}</div>
    </div>
  );
};

export default SidebarSection;
