import { ParentComponent } from "solid-js";

const Box: ParentComponent = (props) => {
  return (
    <div class="rounded-lg border p-3 dark bg-[#E6E6E6] border-[#dddddd] dark:bg-[#282828] dark:border-neutral-600 h-full w-full">
      {props.children}
    </div>
  );
};

export default Box;
