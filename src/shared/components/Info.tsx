import { FiInfo } from "solid-icons/fi";
import { ParentComponent } from "solid-js";

const Info: ParentComponent<{
  onClick?: (e: MouseEvent) => void;
}> = (props) => {
  return (
    <div
      classList={{ "flex gap-1.5 text-info text-xs items-center": true, "cursor-pointer": Boolean(props.onClick) }}
      onClick={props.onClick}
    >
      <FiInfo />
      {props.children}
    </div>
  );
};

export default Info;
