import { getInvoices, type GetInvoiceData } from "@/bindings";
import { useI18n } from "@/i18n";
import Table, { type Indicies } from "@/screens/Dashboard/components/Table";
import { FiDownload, FiEdit, FiPlus, FiTrash } from "solid-icons/fi";
import { type Component, createSignal } from "solid-js";
import Popover from "@/shared/components/Popover";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { useNavigate } from "@solidjs/router";

const Invoices: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [invoicePopover, setInvoicePopover] = createSignal(false);

  const handleEdit = (item: GetInvoiceData) => {
    navigate(`${item.id}`);
  };

  const handleDelete = (item: GetInvoiceData) => {
    console.log("Delete:", item);
    // Handle delete action
  };
  const handleDownload = (item: GetInvoiceData) => {
    // Handle download action
    window.print();
  };

  const fetchInvoices = async (indices: Indicies) => {
    return await getInvoices(indices);
  };

  const rowActions = [
    {
      label: "Download",
      onClick: handleDownload,
      icon: FiDownload,
    },
    {
      label: "Edit",
      onClick: handleEdit,
      icon: FiEdit,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      icon: FiTrash,
    },
  ];

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.invoices")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Table
        columns={[{ field: "id", header: "ID" }]}
        totalItems={15}
        loadPage={fetchInvoices}
        rowActions={rowActions}
      />
      <Popover show={invoicePopover()} onClose={() => setInvoicePopover(false)} title="Create Invoice">
        <div>cuspoic</div>
      </Popover>
    </Container>
  );
};

export default Invoices;
