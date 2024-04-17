import type { Component, JSX } from "solid-js";
import { For, createEffect, createSignal } from "solid-js";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, DisclosureStateChild, Transition } from "terracotta";
import { TbSelector } from "solid-icons/tb";
import { FiCheck } from "solid-icons/fi";

interface ComboboxItem {
  id: number | string;
  label: string;
}

interface ComboboxProps {
  data: ComboboxItem[];
  onSelect: (value: ComboboxItem) => void;
  label: string;
  defaultValueId?: number | string;
}

const SearchDropdown: Component<ComboboxProps> = (props) => {
  const [selected, setSelected] = createSignal<ComboboxItem>(props.data[0]);

  createEffect(() => {
    if (props.defaultValueId) setSelected(props.data.find((item) => item.id === props.defaultValueId) as ComboboxItem);
  }, [props.defaultValueId]);

  const handleSelect = (value: ComboboxItem | undefined) => {
    if (!value) return;
    setSelected(value);
    props.onSelect(value);
  };

  const matchBy = (item: ComboboxItem, query: string): boolean => {
    return item.label.toLowerCase().includes(query.toLowerCase());
  };

  return (
    <div class="flex flex-col gap-1">
      <span class="text-xs text-secondary">{props.label}</span>
      <Combobox<ComboboxItem>
        defaultOpen={false}
        value={selected()}
        onSelectChange={handleSelect}
        matchBy={matchBy}
        class="relative"
      >
        <ComboboxInput
          class="z-1 relative w-full py-1.5 pl-3 pr-10 text-left bg-element border-default border-1 rounded-md h-9 cursor-default focus:outline-none text-sm"
          placeholder="Select an item"
          value={selected()?.label ?? ""}
        />
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ">
          <TbSelector class="w-5 h-5 text-primary" aria-hidden="true" />
        </span>
        <DisclosureStateChild>
          {({ isOpen }): JSX.Element => (
            <Transition
              show={isOpen()}
              enter="transition ease-in duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ComboboxOptions class="z-100 absolute w-full py-1 mt-1 overflow-auto text-base bg-element border-default border-1 rounded-md shadow-lg max-h-60 focus:outline-none sm:text-sm">
                <For each={props.data}>
                  {(item): JSX.Element => (
                    <ComboboxOption class="focus:outline-none group z-99" value={item}>
                      {({ isActive, matches }): JSX.Element => (
                        <div
                          classList={{
                            "bg-secondary": isActive(),
                            "cursor-default select-none relative py-2 pl-10 pr-4": true,
                            hidden: !matches(),
                          }}
                        >
                          <span
                            classList={{
                              "font-medium": selected().id === item.id,
                              "font-normal": selected().id !== item.id,
                              "block truncate": true,
                            }}
                          >
                            {item.label}
                          </span>
                          {selected().id === item.id ? (
                            <span
                              classList={{
                                "text-primary": true,
                                "absolute inset-y-0 left-0 flex items-center pl-3": true,
                              }}
                            >
                              <FiCheck class="w-5 h-5" />
                            </span>
                          ) : null}
                        </div>
                      )}
                    </ComboboxOption>
                  )}
                </For>
              </ComboboxOptions>
            </Transition>
          )}
        </DisclosureStateChild>
      </Combobox>
    </div>
  );
};

export default SearchDropdown;
