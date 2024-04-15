import { FiChevronDown, FiChevronUp } from "solid-icons/fi";
import { type Component, createSignal, For, onMount, Show } from "solid-js";

interface Row {
  key: string;
  value: string | number | boolean | object;
  isCollapsible: boolean;
  collapsed: boolean;
}

const TemplateBuilderHint: Component<{ data?: object }> = (props) => {
  const [rows, setRows] = createSignal<Row[]>([]);

  const initializeRows = () => {
    const hintData = props.data || hints;
    const hintRows = Object.entries(hintData)
      .map(([key, value]) => ({
        key,
        value,
        isCollapsible: typeof value === "object",
        collapsed: true,
      }))
      .sort((a, b) => Number(a.isCollapsible) - Number(b.isCollapsible));
    setRows(hintRows);
  };

  onMount(initializeRows);

  const getKey = (row: Row) => {
    const isArray = Array.isArray(row.value);
    if (isArray) {
      return `${row.key}[number]`;
    }
    return row.key;
  };

  const toggleCollapse = (index: number) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const row = updatedRows[index];
      updatedRows[index] = { ...row, collapsed: !row.collapsed }; // Update only the clicked row
      return updatedRows;
    });
  };

  return (
    <For each={rows()}>
      {(r, i) => (
        <>
          <div
            class={`flex gap-2 text-sm text-secondary whitespace-nowrap items-center  ${
              r.isCollapsible ? "cursor-pointer" : ""
            }`}
            onClick={() => r.isCollapsible && toggleCollapse(i())}
          >
            <div>{getKey(r)}</div>
            <Show when={!r.isCollapsible}>
              <div class="font-semibold text-primary">{String(r.value)}</div>
            </Show>
            <Show when={r.isCollapsible && Array.isArray(r.value)}>
              <div class="text-blue-600 bg-blue-100 border-default border tracking-tighter rounded text-xs px-1">
                Array
              </div>
            </Show>
            <Show when={r.isCollapsible && !Array.isArray(r.value)}>
              <div class="text-pink-600 bg-pink-100 border-default border tracking-tighter rounded text-xs px-1">
                Object
              </div>
            </Show>
            <Show when={r.isCollapsible}>
              <Show when={r.collapsed} fallback={<FiChevronUp />}>
                <FiChevronDown />
              </Show>
            </Show>
          </div>
          <Show when={!r.collapsed && r.isCollapsible}>
            <div class="border-l-1 border-default pl-3">
              <TemplateBuilderHint data={r.value as object} />
            </div>
          </Show>
        </>
      )}
    </For>
  );
};

export default TemplateBuilderHint;

//TODO: Replace this with i18n
const hints = {
  id: "template id",
  number: "INV-2024-001",
  documentType: "Invoice",
  client: {
    name: "Client Name",
    cin: "CIN",
    vatId: "VAT",
    address: "Address Line",
    city: "City",
    zip: "Zip Code",
    email: "Email",
    phone: "Phone",
  },
  company: {
    name: "Company Name",
    cin: "CIN",
    vatId: "VAT",
    address: "Address Line",
    city: "City",
    zip: "Zip Code",
    email: "Email",
    phone: "Phone",
  },
  currency: {
    name: "US Dollar",
    code: "USD",
  },
  issueDate: "2024-04-14",
  taxDate: "2024-04-14",
  dueDate: "",
  items: [
    {
      description: "Product description",
      quantity: 10,
      price: 9.99,
      tax: 1.99,
    },
  ],
};
