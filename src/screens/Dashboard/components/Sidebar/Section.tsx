import { ParentComponent } from "solid-js";

interface ISidebarSectionProps {
  title: string;
}

const SidebarSection: ParentComponent<ISidebarSectionProps> = (props) => {
  return (
    <div class="mt-5">
      <div class="text-black text-sm font-semibold">{props.title}</div>
      <div class="">{props.children}</div>
    </div>
  );
};

export default SidebarSection;
