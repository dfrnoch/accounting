import type { ParentComponent } from "solid-js";

interface IProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: ParentComponent<IProfileButtonProps> = (props) => {
  return (
    <div
      onClick={props.onClick}
      class="inline-flex justify-center items-center w-9 h-9 rounded-md border-t transition-all transform border-zinc-700/50 bg-zinc-800 active:translate-y-1 hover:bg-zinc-700 text-red"
    >
      {props.children}
    </div>
  );
};

export default ProfileButton;
