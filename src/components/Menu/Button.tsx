
import { Component } from "solid-js";

interface IMenuButtonProps {
    label: string;
    icon: string;
    active: boolean;
    onClick: () => void;
}


const MenuButton: Component<IMenuButtonProps> = (props) => {

  return (
    <div class="flex items-center justify-center bg-gray transition-all hover:bg-gray-100 gap-4">
        {props.label}
    </div>
  );
};

export default MenuButton;
