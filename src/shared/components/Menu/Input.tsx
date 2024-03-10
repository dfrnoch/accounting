import { FiInfo } from "solid-icons/fi";
import { Component, Show, createSignal } from "solid-js";

const Input: Component<{
  id: string;
  label?: string;
  placeholder?: string;
  info?: string;
  class?: string;
  onChange?: (e: Event) => void;
}> = (props) => {
  const [showInfo, setShowInfo] = createSignal(false);

  return (
    <div class={`flex flex-row items-center justify-right ${props.class}`}>
      <label for={props.id} class="inline-block text-sm font-medium text-neutral-300">
        {props.label}
      </label>
      <input
        id={props.id}
        type="text"
        classList={{
          "ml-5 w-60 h-8 py-1 text-sm border text-primary border-neutral-900 rounded-md shadow-inner bg-neutral-900 px-2 focus:outline-none focus:border-primary bg-secondary": true,
          "mr-6": !props.info,
        }}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      <Show when={props.info}>
        <div
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          class="relative ml-3 w-3 h-3"
        >
          <FiInfo class="text-white w-4 h-4" />
          <Show when={showInfo()}>
            <div class="absolute top-(-2) left-(-2) bg-neutral-900 text-primary p-2 rounded-md shadow-md text-sm w-50 flex gap-2 items-baseline justify-start ">
              <FiInfo class="text-white w-4 h-4" />

              {props.info}
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default Input;
