// Dropdown.tsx
import type { Component, JSX } from "solid-js";
import { For, createSignal } from "solid-js";
import { DisclosureStateChild, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "terracotta";
import { TbSelector } from "solid-icons/tb";

const companies = [
  { name: "Acme Inc." },
  { name: "Globex Corporation" },
  { name: "Stark Industries" },
  { name: "Wayne Enterprises" },
  { name: "Umbrella Corporation" },
  { name: "Oscorp Industries" },
];

const Dropdown: Component<{}> = (props) => {
  const [selected, setSelected] = createSignal(companies[0]);

  return (
    <div class="w-full">
      <Listbox defaultOpen={false} value={selected()} onSelectChange={setSelected}>
        <div class="relative mt-1">
          <ListboxButton class="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span class="block truncate">{selected().name}</span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <TbSelector class="w-5 h-5 text-gray-400" aria-hidden="true" />
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
                  class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <For each={companies}>
                    {(company): JSX.Element => (
                      <ListboxOption class="focus:outline-none group" value={company}>
                        {({ isActive, isSelected }): JSX.Element => (
                          <div
                            classList={{
                              "text-amber-900 bg-amber-100": isActive(),
                              "text-gray-900": !isActive(),
                              "group-hover:text-amber-900 group-hover:bg-amber-100": true,
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
                              {company.name}
                            </span>
                            {isSelected() ? (
                              <span
                                classList={{
                                  "text-amber-600": isActive(),
                                  // "text-amber-600": !isActive(),
                                  "group-hover:text-amber-600": true,
                                  "absolute inset-y-0 left-0 flex items-center pl-3": true,
                                }}
                              >
                                {/* <CheckIcon class="w-5 h-5" aria-hidden="true" /> */}
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
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
