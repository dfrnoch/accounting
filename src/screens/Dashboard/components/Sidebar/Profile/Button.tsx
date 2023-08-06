import { ParentComponent } from "solid-js";

const ProfileButton: ParentComponent = (props) => {
  return (
    <div class="inline-flex h-9 w-9 transform items-center justify-center rounded-md border-t border-zinc-700/50 bg-zinc-800 active:translate-y-1 hover:bg-zinc-700 transition-all  text-red">
      {props.children}
    </div>
  );
};

export default ProfileButton;
