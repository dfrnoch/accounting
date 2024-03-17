import { For } from "solid-js";

interface TableHeadProps<T> {
  columns: Array<{ field: keyof T; header: string }>;
  hasActions: boolean;
}

const TableHead = <T,>(props: TableHeadProps<T>) => {
  return (
    <thead>
      <tr class="text-left bg-fills-opaque-5 shadow-segmented-control">
        <For each={props.columns}>
          {(column, index) => (
            <th
              class={`px-3 py-1 text-primary text-sm tracking-wider ${index() === 0 ? "rounded-l-lg" : ""} ${
                index() === props.columns.length - 1 && !props.hasActions ? "rounded-r-lg " : ""
              }`}
            >
              {column.header}
            </th>
          )}
        </For>
        {props.hasActions && <th class="px-3 py-1 text-primary text-sm tracking-wider rounded-r-lg">Actions</th>}
      </tr>
    </thead>
  );
};

export default TableHead;
