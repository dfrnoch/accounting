import { For, Component } from "solid-js";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: Component<PaginationProps> = (props) => {
  const pageNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= props.totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  };

  return (
    <div class="flex justify-center gap-3 items-center mt-4">
      <For each={pageNumbers()}>
        {(number) => (
          <button
            type="button"
            class={`px-3 py-1 ${
              props.currentPage === number ? "text-white bg-blue-500" : "text-blue-500"
            } hover:bg-blue-700 rounded`}
            onClick={() => props.onPageChange(number)}
          >
            {number}
          </button>
        )}
      </For>
    </div>
  );
};

export default Pagination;
