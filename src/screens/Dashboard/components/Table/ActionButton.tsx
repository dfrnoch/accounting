import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";

interface ActionButtonProps {
  onClick: () => void;
  icon?: Component;
}

const ActionButton: Component<ActionButtonProps> = (props) => {
  return (
    <button type="button" class="text-default w-5 h-5 bg-red/0" onClick={props.onClick}>
      <Dynamic component={props.icon} />
    </button>
  );
};

export default ActionButton;
