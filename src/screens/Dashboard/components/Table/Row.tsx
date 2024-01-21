import { ParentComponent } from "solid-js";

const Row: ParentComponent = (props) => {
  return <tr class="p-2 border-b border-b-gray">{props.children}</tr>;
};

export default Row;
