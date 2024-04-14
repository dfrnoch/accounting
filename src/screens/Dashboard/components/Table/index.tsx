import { createSignal, For, type Component, type JSX, Suspense, createResource } from "solid-js";
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
  columns: Array<{ field: keyof T; header: string; component?: (item: T) => JSX.Element }>;
  rowActions?: Array<RowAction<T>>;
  loadPage: (indices: Indicies) => Promise<T[]>;
  totalItems: Promise<number>;
  allowedCounts?: number[];
}

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
  const [totalItems] = createResource<number>(async () => await props.totalItems);
  const [indicies, setIndicies] = createSignal<Indicies>({ skip: 0, take: props.allowedCounts?.[0] || 10 });

  const [data] = createResource(indicies, props.loadPage);

  return (
    <div class="flex h-full flex-col justify-between">
      <table class="min-w-full leading-normal">
        <TableHead columns={props.columns} hasActions={!!props.rowActions} />
        <tbody class="overflow-y-auto">
          <Suspense>
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
          </Suspense>
        </tbody>
      </table>
      <Suspense>
        <Pagination
          allowedCounts={props.allowedCounts}
          itemCount={totalItems() as number}
          onIndexChange={(indices) => setIndicies(indices)}
        />
      </Suspense>
    </div>
  );
};

export default Table;
