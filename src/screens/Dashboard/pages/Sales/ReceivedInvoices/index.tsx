import { DocumentType, getDocuments, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { useNavigate } from "@solidjs/router";

const ReceivedInvoices: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.receivedInvoices")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Table
        columns={[
          { field: "number", header: t("pages.sales.table.number") },
          { field: "client", header: t("pages.sales.table.client") },
          {
            field: "totalPrice",
            header: t("pages.sales.table.total"),
            component: (item) => (
              <>
                {item.totalPrice} {item.currency}
              </>
            ),
          },
          {
            field: "issueDate",
            header: t("pages.sales.table.date"),
            component: (item) => new Date(item.issueDate as string).toLocaleDateString(),
          },
        ]}
        totalItems={getModelCount("Receive")}
        loadPage={async (indices) => await getDocuments(indices, DocumentType.RECEIVE)}
        onClickRow={(item) => navigate(`${item.id}`)}
      />
    </Container>
  );
};

export default ReceivedInvoices;
