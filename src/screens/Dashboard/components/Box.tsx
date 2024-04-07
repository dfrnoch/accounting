import type { ParentComponent } from "solid-js";

const Box: ParentComponent = (props) => {
  return (
    <div class="rounded-lg border p-3 bg-[#E6E6E6] border-default dark:bg-[#282828] h-full w-full">
      {props.children}
    </div>
  );
};

export default Box;
