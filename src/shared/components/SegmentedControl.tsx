import { For, ParentComponent, createSignal } from "solid-js";

interface SegmentedControlProps {
  options: {
    id: string;
    label: string;
  }[];
  onChange?: (value: string) => void;
}

export const SegmentedControl: ParentComponent<SegmentedControlProps> = (props) => {
  const [selectedValue, setSelectedValue] = createSignal(props.options[0]?.id || "");

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setSelectedValue(target.value);
    props.onChange?.(target.value);
  };

  return (
    <fieldset class="relative p-[1px] h-auto flex items-stretch overflow-hidden rounded-[6px] shadow-segmented-control bg-fills-opaque-5 dark:bg-[#1C1C1F] ">
      <For each={props.options}>
        {(option) => (
          <input
            id={option.id}
            type="radio"
            value={option.id}
            name="segmented-control"
            checked={selectedValue() === option.id}
            onChange={handleChange}
            class="transition-all w-100px appearance-none relative h-[22px] flex-1 rounded dark:(checked:bg-[#636366] active:bg-[#636366] active:opacity-100) active-(opacity-50 bg-white) checked-(bg-white shadow-sm before:hidden) first:before:hidden before:absolute before:z-[-1] before:left-[-1px] before:top-[5px] before:w-[1px] before:h-[10px] before:bg-fills-opaque-4 before:rounded"
          />
        )}
      </For>

      <div class="absolute inset-0 w-full h-full flex items-center">
        <For each={props.options}>
          {(option) => <label for={option.id} class="flex-1 text-center text-sm" textContent={option.label} />}
        </For>
      </div>
    </fieldset>
  );
};
