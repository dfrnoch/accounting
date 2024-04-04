import type { ParentComponent } from "solid-js";

const Container: ParentComponent = (props) => {
  return <div class="pt-10px px-4 w-full h-full">{props.children}</div>;
};

export default Container;
