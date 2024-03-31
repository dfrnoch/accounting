import { type Component, For, Show, type JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiChevronLeft, FiChevronRight } from "solid-icons/fi";

interface PageHeaderProps {
  title: string[];
  actionElements?: JSX.Element[];
}

const PageHeader: Component<PageHeaderProps> = (props) => {
  const navigate = useNavigate();

  return (
    <div class="flex fixed top-0 left-0 flex-row w-screen h-[40px] z-50">
      <div
        class="flex items-center justify-end w-1/5 h-full lg:max-w-[220px] min-w-[200px] shrink-0 px-2.5 lg:px-4 text-primary"
        data-tauri-drag-region
      />
      <div
        class="flex justify-between items-center px-3 w-4/5 h-full border-b lg:px-6 lg:w-full border-black/20  backdrop-blur-lg bg-[#E3E3E3]/80 dark:bg-[#262626]/80 z-5"
        data-tauri-drag-region
      >
        <div class="flex flex-row h-full">
          <div class="flex items-center justify-center  gap-3 text-sm font-semibold mr-5" data-tauri-drag-region>
            <button
              class="rounded hover:bg-fills-opaque-4 bg-transparent transition-all p-1 flex items-center justify-center text-primary"
              type="button"
              onClick={() => navigate(-1)}
            >
              <FiChevronLeft class="w-5 h-5 " />
            </button>

            <button
              class="rounded hover:bg-fills-opaque-4 bg-transparent transition-all p-1 flex items-center justify-center text-primary"
              type="button"
              onClick={() => navigate(1)}
            >
              <FiChevronRight class="w-5 h-5" />
            </button>
          </div>
          <div class="flex gap-1 items-center h-full text-sm font-semibold" data-tauri-drag-region>
            <For each={props.title}>
              {(item, index) => (
                <Show
                  when={index() === props.title.length - 1}
                  fallback={
                    <>
                      <span class="text-secondary" data-tauri-drag-region>
                        {item}
                      </span>
                      <span class="text-secondary" data-tauri-drag-region>
                        /
                      </span>
                    </>
                  }
                >
                  <span class="text-primary" data-tauri-drag-region>
                    {item}
                  </span>
                </Show>
              )}
            </For>
          </div>
        </div>
        <div class="flex flex-row gap-4 items-center py-1.5 h-full text-primary">
          {props.actionElements?.reverse().map((item) => item)}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
