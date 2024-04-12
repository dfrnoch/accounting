import { Show, type ParentComponent } from "solid-js";

const Section: ParentComponent<{ title?: string }> = (props) => {
  return (
    <div>
      <Show when={props.title}>
        <h2 class="text-primary text-sm font-semibold pb-2">{props.title}</h2>
      </Show>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">{props.children}</div>
    </div>
  );
};

export default Section;
