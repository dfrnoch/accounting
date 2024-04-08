import type { ParentComponent } from "solid-js";

const StatusIcon: ParentComponent = (props) => {
  return <div class="bg-red rounded border-black border-1 w-20 ">{props.children}</div>;
};

export default StatusIcon;
