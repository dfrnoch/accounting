import { ParentComponent } from "solid-js";
//@ts-expect-error
import { Motion } from "motionone/packages/solid";

interface IPopoverProps {
  title: string;
  onClose: () => void;
}

const Popup: ParentComponent<IPopoverProps> = (props) => {
  return (
    <Motion.div
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, easing: "ease-in-out" }}
      class="flex fixed top-0 left-0 justify-center items-center w-screen h-screen backdrop-blur-sm transition-all z-[99] bg-neutral-500/20"
      onClick={(e: MouseEvent) => {
        if (e.target === e.currentTarget) {
          props.onClose();
        }
      }}
    >
      <Motion.div
        exit={{ scale: 0.5 }}
        animate={{ scale: [0.8, 1] }}
        transition={{ duration: 0.1, easing: "ease-in-out" }}
        class="bg-secondary p-8 w-[80%] lg:w-[45%] rounded-md max-h-[80%] overflow-x-auto shadow-md"
      >
        <div class="flex justify-between">
          <h1 class="text-xl font-bold text-gray-700 uppercase">{props.title}</h1>
          <button onClick={props.onClose} class="text-red-500 hover:text-red-700" type="button">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Zavrit</title>
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <hr class="m-4" />

        <div class="flex flex-col gap-4">{props.children}</div>
      </Motion.div>
    </Motion.div>
  );
};

export default Popup;
