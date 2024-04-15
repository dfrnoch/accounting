import { For } from "solid-js";

interface TableHeadProps<T> {
  columns: Array<{ field: keyof T; header: string }>;
}

const TableHead = <T,>(props: TableHeadProps<T>) => {
  return (
    <thead>
      <tr class="text-left bg-[#fff] dark:bg-#353536 shadow-menu-border">
        <For each={props.columns}>
          {(column, index) => (
            <th
              class="px-3 py-1 text-primary text-sm tracking-wider rounded-r-lg"
              classList={{
                "rounded-l-lg": index() === 0,
                "rounded-r-lg": index() === props.columns.length - 1,
              }}
            >
              {column.header}
            </th>
          )}
        </For>
      </tr>
    </thead>
  );
};

export default TableHead;
