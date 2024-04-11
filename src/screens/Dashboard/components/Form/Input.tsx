import type { ValidationError } from "@tanstack/solid-form";
import { For, Show, type Component } from "solid-js";

type TextInputProps = {
  type: "text" | "date" | "email" | "tel";
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  errors?: ValidationError[];
};

type NumberInputProps = {
  type: "number";
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
  defaultValue?: number;
  errors?: ValidationError[];
};

type InputProps = TextInputProps | NumberInputProps;

const Input: Component<InputProps> = (props) => {
  const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    if (props.type === "number") {
      props.onChange(Number(value) as never);
    } else {
      props.onChange(value as never);
    }
  };

  return (
    <label class="flex flex-col gap-1">
      <span class="text-xs text-secondary">{props.label}</span>
      <input
        type={props.type}
        class="w-full px-2 py-1.5 border rounded-md bg-element text-sm  transition-all"
        classList={{
          "border-danger ": props.errors ? props.errors.length > 0 : false,
          "border-default": !props.errors || props.errors.length === 0,
        }}
        onInput={handleInput}
        placeholder={props.placeholder}
        value={props.defaultValue}
      />
      <Show when={props.errors}>
        <For each={props.errors}>{(error) => <span class="text-xs text-danger">{error?.toString()}</span>}</For>
      </Show>
    </label>
  );
};

export default Input;
