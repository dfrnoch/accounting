import { For, type JSX, Show } from "solid-js";
import ActionButton from "./ActionButton";
import type { RowAction } from ".";

interface TableRowProps<T> {
  item: T;
  columns: Array<{ field: keyof T; header: string; component?: (item: T) => JSX.Element }>;
  rowActions?: Array<RowAction<T>>;
}
const TableRow = <T,>(props: TableRowProps<T>) => {
  return (
    <tr class="border-b border-default">
      <For each={props.columns}>
        {(column) => <td class="px-3 py-2">{column.component?.(props.item) ?? String(props.item[column.field])}</td>}
      </For>
      <Show when={props.rowActions}>
        <td class="px-3 py-2 flex flex-row gap-2 items-center">
          <For each={props.rowActions}>
            {(action) => <ActionButton onClick={() => action.onClick(props.item)} icon={action.icon} />}
          </For>
        </td>
      </Show>
    </tr>
  );
};

export default TableRow;
