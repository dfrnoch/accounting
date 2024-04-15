import { For, type JSX } from "solid-js";

interface TableRowProps<T> {
  item: T;
  columns: Array<{ field: keyof T; header: string; component?: (item: T) => JSX.Element }>;
  onClick?: (item: T) => void;
}
const TableRow = <T,>(props: TableRowProps<T>) => {
  return (
    <tr
      onClick={() => props.onClick?.(props.item)}
      class="border-b border-default"
      classList={{
        "cursor-pointer transition-all hover:bg-fills-opaque-5": Boolean(props.onClick),
      }}
    >
      <For each={props.columns}>
        {(column) => <td class="px-3 py-2">{column.component?.(props.item) ?? String(props.item[column.field])}</td>}
      </For>
    </tr>
  );
};

export default TableRow;
