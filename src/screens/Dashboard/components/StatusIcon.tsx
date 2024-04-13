import type { ParentComponent } from "solid-js";

const StatusIcon: ParentComponent = (props) => {
  return (
    <div class="flex items-center justify-center bg-default border-default rounded-md border-1 max-w-30 text-sm">
      {props.children}
    </div>
  );
};

export default StatusIcon;
