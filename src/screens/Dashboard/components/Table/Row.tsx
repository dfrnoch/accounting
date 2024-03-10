import { Component, For, Show } from "solid-js";
import ActionButton from "./ActionButton";

interface TableRowProps<T> {
  item: T;
  columns: Array<{ field: keyof T; header: string }>;
  rowActions?: Array<{ onClick: (item: T) => void; icon?: Component }>;
}

const TableRow = <T,>(props: TableRowProps<T>) => {
  return (
    <tr class="border-b border-gray-200">
      <For each={props.columns}>{(column) => <td class="px-3 py-3">{String(props.item[column.field])}</td>}</For>
      <Show when={props.rowActions}>
        <td class="px-3 py-3 flex flex-row gap-2 items-center">
          <For each={props.rowActions}>
            {(action) => <ActionButton onClick={() => action.onClick(props.item)} icon={action.icon} />}
          </For>
        </td>
      </Show>
    </tr>
  );
};

export default TableRow;
