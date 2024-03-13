import { ParentComponent } from "solid-js";

const Popup: ParentComponent<{}> = (props) => {
  return <div>{props.children}</div>;
};

export default Popup;
