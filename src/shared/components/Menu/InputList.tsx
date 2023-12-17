import { ParentComponent } from "solid-js";

const InputList: ParentComponent = (props) => {
  //   TODO: margin l r
  return (
    <div class="flex items-center ">
      <div class="flex flex-col gap-4 w-full ">{props.children}</div>
    </div>
  );
};

export default InputList;
