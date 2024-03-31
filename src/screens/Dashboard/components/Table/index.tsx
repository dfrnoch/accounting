// Table.tsx
import { createSignal, onMount, For, type Component } from "solid-js";
import Pagination from "./Pagination";
import TableHead from "./TableHeader";
import TableRow from "./Row";

interface TableProps<T extends Record<string, unknown>> {
  columns: Array<{ field: keyof T; header: string }>;
  rowActions?: Array<{ label: string; onClick: (item: T) => void; icon?: Component }>;
  loadPage: (indices: { start: number; end: number }) => Promise<T[]>;
  totalItems: number;
  allowedCounts?: number[];
}

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
  const [data, setData] = createSignal<T[]>([]);

  const loadData = async (indices: { start: number; end: number }) => {
    const newData = await props.loadPage(indices);
    setData(newData);
  };

  onMount(async () => {
    await loadData({ start: 0, end: 10 });
  });

  return (
    <div class="flex h-full flex-col justify-between">
      <table class="min-w-full leading-normal">
        <TableHead columns={props.columns} hasActions={!!props.rowActions} />
        <tbody class="overflow-y-auto">
          <For each={data()}>
            {(item) => (
              <TableRow
                item={item}
                columns={props.columns}
                rowActions={props.rowActions?.map((action) => ({
                  onClick: () => action.onClick(item),
                  icon: action.icon,
                }))}
              />
            )}
          </For>
        </tbody>
      </table>
      <Pagination allowedCounts={props.allowedCounts} itemCount={props.totalItems} onIndexChange={loadData} />
    </div>
  );
};

export default Table;
