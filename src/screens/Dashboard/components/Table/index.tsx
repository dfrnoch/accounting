import { createSignal, createEffect, For, type Component } from "solid-js";
import Pagination from "./Pagination";
import TableHead from "./TableHeader";
import TableRow from "./Row";
import { Search } from "@/shared/components/Search";

interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Array<{ field: keyof T; header: string }>;
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
    <div class="flex h-full flex-col justify-between">
      {/* <div class="flex flex-row justify-between mb-4"> */}
      {/* <Search onInput={(e) => setSearchTerm(e.currentTarget.value)} /> */}
      {/* <div>{props.extraContent}</div> */}
      {/* </div> */}
      <table class="min-w-full leading-normal">
        <TableHead columns={props.columns} hasActions={!!props.rowActions} />
        <tbody class="overflow-y-auto">
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
  );
};

export default Table;
