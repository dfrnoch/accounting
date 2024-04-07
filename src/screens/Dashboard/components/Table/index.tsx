import { createSignal, onMount, For, type Component } from "solid-js";
import Pagination from "./Pagination";
import TableHead from "./TableHeader";
import TableRow from "./Row";

export interface Indicies {
  skip: number;
  take: number;
}

export interface RowAction<T> {
  onClick: (item: T) => void;
  icon?: Component;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Array<{ field: keyof T; header: string }>;
  rowActions?: Array<RowAction<T>>;
  loadPage: (indices: Indicies) => Promise<T[]>;
  totalItems: number;
  allowedCounts?: number[];
}

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
  const [data, setData] = createSignal<T[]>([]);

  const loadData = async (indices: { skip: number; take: number }) => {
    const newData = await props.loadPage(indices);
    setData(newData);
  };

  onMount(async () => {
    await loadData({ skip: 0, take: props.allowedCounts?.[0] || 10 });
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
                  ...action,
                  onClick: () => action.onClick(item),
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
