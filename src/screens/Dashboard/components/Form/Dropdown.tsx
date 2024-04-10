import type { Component, JSX } from "solid-js";
import { For, createSignal } from "solid-js";
import { DisclosureStateChild, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "terracotta";
import { TbSelector } from "solid-icons/tb";
import { FiCheck } from "solid-icons/fi";

interface DropdownItem {
  id: number | string;
  label: string;
}

interface DropdownProps {
  data: DropdownItem[];
  onSelect: (value: DropdownItem) => void;
  label: string;
}

const Dropdown: Component<DropdownProps> = (props) => {
  const [selected, setSelected] = createSignal(props.data[0]);

  const handleSelect = (value: DropdownItem | undefined) => {
    if (!value) return;
    setSelected(value);
    props.onSelect(value);
  };

  return (
    <div class="flex flex-col gap-1">
      <span class="text-xs text-secondary">{props.label}</span>
      <Listbox defaultOpen={false} value={selected()} onSelectChange={handleSelect} class="relative">
        <ListboxButton class="relative w-full py-1.5 pl-3 pr-10 text-left bg-element border-default border-1 rounded-lg cursor-default focus:outline-none text-sm">
          <span class="block truncate">{selected().label}</span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <TbSelector class="w-5 h-5 text-primary" aria-hidden="true" />
          </span>
        </ListboxButton>
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
              <ListboxOptions
                unmount={false}
                class="absolute w-full py-1 mt-1 overflow-auto text-base bg-element border-default border-1 rounded-md shadow-lg max-h-60 focus:outline-none sm:text-sm"
              >
                <For each={props.data}>
                  {(item): JSX.Element => (
                    <ListboxOption class="focus:outline-none group" value={item}>
                      {({ isActive, isSelected }): JSX.Element => (
                        <div
                          classList={{
                            "bg-default": isActive(),
                            "cursor-default select-none relative py-2 pl-10 pr-4": true,
                          }}
                        >
                          <span
                            classList={{
                              "font-medium": isSelected(),
                              "font-normal": !isSelected(),
                              "block truncate": true,
                            }}
                          >
                            {item.label}
                          </span>
                          {isSelected() ? (
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
                    </ListboxOption>
                  )}
                </For>
              </ListboxOptions>
            </Transition>
          )}
        </DisclosureStateChild>
      </Listbox>
    </div>
  );
};

export default Dropdown;
