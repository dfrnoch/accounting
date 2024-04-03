import { type ParentComponent, Show } from "solid-js";
import { Motion } from "solid-motionone";

interface IPopoverProps {
  title: string;
  onClose: () => void;
  show: boolean;
}

const Popover: ParentComponent<IPopoverProps> = (props) => {
  return (
    <Show when={props.show}>
      <Motion.div
        transition={{ duration: 0.3, easing: "ease-in-out" }}
        class="fixed top-0 left-0 w-screen h-screen backdrop-blur-lg transition-all z-[99] bg-black/30 flex justify-center items-center"
        onClick={(e: MouseEvent) => {
          if (e.target === e.currentTarget) {
            props.onClose();
          }
        }}
        style={{ display: props.show ? "flex" : "none" }}
      >
        <Motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, easing: "ease-in-out" }}
          class="bg-white p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[45%] rounded-xl max-h-[80%] overflow-x-auto shadow-2xl"
        >
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">{props.title}</h1>
            <button
              onClick={props.onClose}
              class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
              aria-label="Close"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>a</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <hr class="border-gray-200 mb-6" />

          <div class="text-gray-700 text-base leading-relaxed">{props.children}</div>
        </Motion.div>
      </Motion.div>
    </Show>
  );
};

export default Popover;
