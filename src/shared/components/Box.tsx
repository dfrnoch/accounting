import { Show, type ParentComponent } from "solid-js";

const Box: ParentComponent<{ onClick: () => void; active?: boolean; icon: string }> = (props) => {
  return (
    <div
      onclick={props.onClick}
      classList={{
        "items-center py-4 border text-primary border-neutral-900 rounded-md shadow-inner bg-neutral-900 px-10 transition cursor-pointer flex flex-col gap-2": true,
        "bg-pimary": props.active,
        "bg-primary": !props.active,
      }}
    >
      <p class="text-3xl">{props.icon}</p>
      <Show when={props.children}>
        <p class="text-center text-sm font-bold leading-tight">{props.children}</p>
      </Show>
    </div>
  );
};

export default Box;
