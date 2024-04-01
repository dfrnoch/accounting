import type { ParentComponent } from "solid-js";
import toast, { type Toast } from "solid-toast";

// TODO
const CustomToast: ParentComponent<{ t: Toast }> = (props) => {
  return (
    <div class="px-6 py-2 pr-12 bg-secondary text-primary rounded-lg shadow-md relative">
      {props.children}
      <button
        type="button"
        class="bg-default flex justify-center top-1/2 -translate-y-1/2 items-center w-6 h-6 right-2.5 absolute rounded-full"
        onClick={() => toast.dismiss(props.t.id)}
      >
        &times;
      </button>
    </div>
  );
};
export default CustomToast;
