import { ParentComponent } from "solid-js";

const Table: ParentComponent = (props) => {
  return <th class="py-1 px-3 bg-grey rounded flex items-center justify-between">{props.children}</th>;
};

export default Table;
