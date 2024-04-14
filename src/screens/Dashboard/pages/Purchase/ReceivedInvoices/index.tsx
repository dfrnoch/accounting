import { getDocuments, DocumentType, type GetDocumentData, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table, { type Indicies } from "@/screens/Dashboard/components/Table";
import { FiEdit, FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";

const Expenses: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  const loadPage = async (indices: Indicies) => {
    return await getDocuments(DocumentType.RECIEVE, indices);
  };

  const handleEdit = (item: GetDocumentData) => {
    navigate(`detail/${item.id}`);
  };

  const rowActions = [
    {
      label: "Edit",
      onClick: handleEdit,
      icon: FiEdit,
    },
  ];

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.purchase"), t("sidebar.button.recievedInvoices")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Table
        columns={[
          { field: "number", header: "Number" },
          { field: "status", header: "Status" },
        ]}
        totalItems={getModelCount("Recieve")}
        loadPage={loadPage}
        rowActions={rowActions}
      />
    </Container>
  );
};

export default Expenses;
