// import { FiInfo } from "solid-icons/fi";
import { ParentComponent } from "solid-js";

const Badge: ParentComponent<{
  color: "success" | "danger" | "info" | "warning";
}> = (props) => {
  return (
    <div
      classList={{
        "flex gap-1.5 text-xs items-center py-0.5 px-1 rounded ": true,
        "text-success bg-success": props.color === "success",
        "text-danger bg-danger ": props.color === "danger",
        "text-info": props.color === "info",
        "text-warning": props.color === "warning",
      }}
    >
      {/* <FiInfo /> */}
      {props.children}
    </div>
  );
};

export default Badge;
