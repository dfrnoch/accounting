import type { Component } from "solid-js";

type TextInputProps = {
  type: "text" | "date";
  onChange: (value: string) => void;
  label: string;
  defaultValue?: string;
};

type NumberInputProps = {
  type: "number";
  onChange: (value: number) => void;
  label: string;
  defaultValue?: number;
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
    <input
      type={props.type}
      class="w-full px-2 py-1 border border-default rounded-lg bg-element border-default"
      onInput={handleInput}
      placeholder={props.label}
      value={props.defaultValue}
    />
  );
};

export default Input;
