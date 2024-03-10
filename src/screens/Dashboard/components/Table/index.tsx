import { createSignal, createEffect, For, JSX, Component } from "solid-js";
import Pagination from "./Pagination";
import TableHead from "./TableHeader";
import TableRow from "./Row";

interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Array<{ field: keyof T; header: string }>;
  extraContent?: JSX.Element;
  rowActions?: Array<{ label: string; onClick: (item: T) => void; icon?: Component }>;
  loadPage: (page: number, pageSize: number) => Promise<T[]>;
  totalItems: number;
}

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
  const [data, setData] = createSignal(props.data);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [itemsPerPage] = createSignal(10);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filteredData, setFilteredData] = createSignal<T[]>([]);

  createEffect(() => {
    const filtered = data().filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm().toLowerCase())),
    );
    setFilteredData(filtered);
  });

  const totalPages = () => Math.ceil(props.totalItems / itemsPerPage());

  const loadPage = async (page: number) => {
    const data = await props.loadPage(page, itemsPerPage());
    setData(data);
    setCurrentPage(page);
  };

  createEffect(() => {
    loadPage(currentPage());
  });

  return (
    <div class="w-full">
      <div class="rounded-lg">
        <div class="flex flex-row justify-between mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            class="border px-2 h-8 rounded"
          />
          <div>{props.extraContent}</div>
        </div>
        <table class="min-w-full leading-normal">
          <TableHead columns={props.columns} hasActions={!!props.rowActions} />
          <tbody>
            <For each={filteredData()}>
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
        <Pagination currentPage={currentPage()} totalPages={totalPages()} onPageChange={loadPage} />
      </div>
    </div>
  );
};

export default Table;
