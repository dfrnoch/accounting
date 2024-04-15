import { DocumentType, getDocuments, getModelCount, type GetDocumentData } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiDownload, FiEdit, FiPlus, FiTrash } from "solid-icons/fi";
import { type Component, createSignal } from "solid-js";
import Popover from "@/shared/components/Popover";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { useNavigate } from "@solidjs/router";
import { getInitializedPrintWindow } from "@/utils/savePDF";

const Invoices: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [invoicePopover, setInvoicePopover] = createSignal(false);

  const handleEdit = (item: GetDocumentData) => {
    navigate(`${item.id}`);
  };

  const handleDownload = (item: GetDocumentData) => {
    getInitializedPrintWindow(item.id);
  };

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
        totalItems={getModelCount("Invoice")}
        loadPage={async (indices) => await getDocuments(DocumentType.INVOICE, indices)}
        onClickRow={(item) => navigate(`${item.id}`)}
        rowActions={[
          {
            onClick: handleDownload,
            icon: FiDownload,
          },
          {
            onClick: handleEdit,
            icon: FiEdit,
          },
        ]}
      />
      <Popover show={invoicePopover()} onClose={() => setInvoicePopover(false)} title="Create Invoice">
        <div>cuspoic</div>
      </Popover>
    </Container>
  );
};

export default Invoices;
