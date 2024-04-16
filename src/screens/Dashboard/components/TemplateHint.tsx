import { useI18n } from "@/i18n";
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
  const [t] = useI18n();

  const hints = {
    number: t("hints.number"),
    client: {
      name: t("hints.client.name"),
      cin: t("hints.client.cin"),
      vatId: t("hints.client.vatId"),
      address: t("hints.client.address"),
      city: t("hints.client.city"),
      zip: t("hints.client.zip"),
      email: t("hints.client.email"),
      phone: t("hints.client.phone"),
      bankAccount: t("hints.client.bankAccount"),
      IBAN: t("hints.client.iban"),
    },
    company: {
      name: t("hints.company.name"),
      cin: t("hints.company.cin"),
      vatId: t("hints.company.vatId"),
      address: t("hints.company.address"),
      city: t("hints.company.city"),
      zip: t("hints.company.zip"),
      email: t("hints.company.email"),
      phone: t("hints.company.phone"),
      bankAccount: t("hints.company.bankAccount"),
      IBAN: t("hints.company.iban"),
    },
    currency: {
      code: t("hints.currency.code"),
    },
    issueDate: t("hints.issueDate"),
    dueDate: t("hints.dueDate"),
    items: [
      {
        description: t("hints.items.description"),
        quantity: t("hints.items.quantity"),
        price: t("hints.items.price"),
      },
    ],
  };

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
                {t("hints.collapsible.array")}
              </div>
            </Show>
            <Show when={r.isCollapsible && !Array.isArray(r.value)}>
              <div class="text-pink-600 bg-pink-100 border-default border tracking-tighter rounded text-xs px-1">
                {t("hints.collapsible.object")}
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
