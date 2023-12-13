import { Component } from "solid-js";
import { Store } from "solid-js/store";

const Input: Component<{
  id: string;
  label?: string;
  placeholder?: string;
  class?: string;
  onChange?: (e) => void;
}> = (props) => {
  return (
    <div class={`flex flex-col gap-1 ${props.class}`}>
      <label for={props.id} class="block text-sm font-medium text-neutral-300">
        {props.label}
      </label>
      <input
        id={props.id}
        type="text"
        class="w-full py-1 border text-primary border-neutral-900 rounded-md shadow-inner bg-neutral-900 px-2 focus:outline-none focus:border-primary bg-secondary "
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
};

export default Input;
