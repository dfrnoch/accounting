import { useI18n } from "@/i18n";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { FiChevronLeft, FiChevronRight } from "solid-icons/fi";
import { Show, createSignal } from "solid-js";
import type { Indicies } from ".";

interface PaginationProps {
  itemCount: number;
  allowedCounts?: number[];
  onIndexChange: (indices: Indicies) => void;
}

const Pagination = (props: PaginationProps) => {
  const [pageNo, setPageNo] = createSignal(1);
  const [count, setCount] = createSignal(props.allowedCounts?.[0] || 10);
  const [t] = useI18n();

  const maxPages = () => Math.ceil(props.itemCount / count());

  const filteredCounts = () => {
    return props.allowedCounts || [10, 20, 50, -1];
  };

  const setPageNoHandler = (value: number) => {
    value = Number.parseInt(String(value));
    if (Number.isNaN(value)) {
      return;
    }

    setPageNo(Math.min(Math.max(1, value), maxPages()));
    emitIndices();
  };

  const setCountHandler = (c: number) => {
    setPageNo(1);
    if (c === -1) {
      c = props.itemCount;
    }
    setCount(c);
    emitIndices();
  };

  const emitIndices = () => {
    const indices = getSliceIndices();
    props.onIndexChange(indices);
  };

  const getSliceIndices = () => {
    const skip = (pageNo() - 1) * count();
    const take = count();
    return { skip, take };
  };

  return (
    <div class="grid grid-cols-3 text-primary text-sm select-none items-center" style="height: 50px">
      {/* Length Display */}
      <div class="justify-self-start">
        {`${(pageNo() - 1) * count() + 1} - ${Math.min(pageNo() * count(), props.itemCount)}`}
      </div>

      {/* Pagination Selector */}
      <div class="flex gap-2 items-center justify-self-center">
        <FiChevronLeft
          class={`w-4 h-4 rtl-rotate-180 ${pageNo() > 1 ? "text-primary cursor-pointer" : "text-transparent"}`}
          onClick={() => setPageNoHandler(Math.max(1, pageNo() - 1))}
        />
        <div class="flex gap-2 bg-secondary rounded h-22px">
          <input
            type="number"
            class="w-8 text-end outline-none bg-transparent "
            value={pageNo()}
            min="1"
            max={maxPages()}
            onChange={(e) => setPageNoHandler(e.target.valueAsNumber)}
            onInput={(e) => setPageNoHandler(e.target.valueAsNumber)}
          />
          <p>/</p>
          <p class="w-8 flex items-center">{maxPages()}</p>
        </div>
        <FiChevronRight
          class={`w-4 h-4 rtl-rotate-180 ${pageNo() < maxPages() ? "text-primary cursor-pointer" : "text-transparent"}`}
          onClick={() => setPageNoHandler(Math.min(maxPages(), pageNo() + 1))}
        />
      </div>

      {/* Count Selector */}
      <div class="justify-self-end w-full">
        <Show when={filteredCounts().length > 1}>
          <SegmentedControl
            options={filteredCounts().map((c) => ({
              id: String(c),
              label: c === -1 ? t("table.all") : String(c),
            }))}
            onChange={(value) => setCountHandler(Number(value))}
          />
        </Show>
      </div>
    </div>
  );
};

export default Pagination;
