import { ParentComponent } from "solid-js";

const TableHeader: ParentComponent = (props) => {
  return <tr class="py-1 px-3 bg-grey">{props.children}</tr>;
};

export default TableHeader;
