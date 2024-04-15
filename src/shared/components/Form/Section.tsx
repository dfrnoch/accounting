import { Show, type ParentComponent } from "solid-js";

const Section: ParentComponent<{ title?: string; columns?: number }> = (props) => {
  return (
    <div>
      <Show when={props.title}>
        <h2 class="text-primary text-sm font-semibold pb-2">{props.title}</h2>
      </Show>
      <div class="grid gap-4" style={{ "grid-template-columns": `repeat(${props.columns || 2}, 1fr)` }}>
        {props.children}
      </div>
    </div>
  );
};

export default Section;
