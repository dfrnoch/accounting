import { createSignal, For, type JSX, Suspense, createResource } from "solid-js";
import Pagination from "./Pagination";
import TableHead from "./TableHeader";
import TableRow from "./Row";

export interface Indicies {
  skip: number;
  take: number;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Array<{ field: keyof T; header: string; component?: (item: T) => JSX.Element }>;
  loadPage: (indices: Indicies) => Promise<T[]>;
  totalItems: Promise<number>;
  allowedCounts?: number[];
  onClickRow?: (item: T) => void;
}

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
  const [totalItems] = createResource<number>(async () => await props.totalItems);
  const [indicies, setIndicies] = createSignal<Indicies>({ skip: 0, take: props.allowedCounts?.[0] || 10 });

  const [data] = createResource(indicies, props.loadPage);

  return (
    <div class="flex h-full flex-col justify-between">
      <table class="min-w-full leading-normal">
        <TableHead columns={props.columns} />
        <tbody class="overflow-y-auto">
          <Suspense>
            <For each={data()}>
              {(item) => <TableRow item={item} columns={props.columns} onClick={props.onClickRow} />}
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
