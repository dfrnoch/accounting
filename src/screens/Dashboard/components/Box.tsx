import { ParentComponent } from "solid-js";

const Box: ParentComponent = (props) => {
  return (
    <div class="rounded-lg border p-2 dark border-[#dddddd] dark:bg-neutral-[#282828] dark:border-neutral-600 h-full w-full">
      {props.children}
    </div>
  );
};

export default Box;
