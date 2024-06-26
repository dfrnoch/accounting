import { useI18n } from "@/i18n";
import { FiSearch } from "solid-icons/fi";
import type { JSX, ParentComponent } from "solid-js";

interface SearchProps {
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
}

export const Search: ParentComponent<SearchProps> = (props) => {
  const [t] = useI18n();

  return (
    <div class="rounded-md overflow-hidden inline-flex justify-between items-center dark:bg-#353536 bg-#d1d1d1 text-base font-light ring-default focus-within:ring-3 ">
      <FiSearch class="mx-2 my-1 text-primary" />
      <input
        type="search"
        onInput={props.onInput}
        placeholder={t("components.search")}
        class="appearance-none outline-none flex-grow text-sm dark-(bg-#353536)  bg-#d1d1d1 text-primary placeholder:text-opaque-3"
      />
    </div>
  );
};
