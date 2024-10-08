import { DocumentType, getDocuments, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { useNavigate } from "@solidjs/router";
import StatusIcon from "@/screens/Dashboard/components/StatusIcon";

const Invoices: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

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
          {
            field: "status",
            header: t("pages.sales.table.status"),
            component: (item) => {
              const status = item.status as string;
              return (
                <StatusIcon status={status}>
                  {(() => {
                    switch (status) {
                      case "PAID":
                        return t("pages.sales.document.status.paid");
                      case "UNPAID":
                        return t("pages.sales.document.status.draft");
                      case "SENT":
                        return t("pages.sales.document.status.sent");
                      case "CANCELLED":
                        return t("pages.sales.document.status.cancelled");
                      case "OVERDUE":
                        return t("pages.sales.document.status.overdue");
                      case "DRAFT":
                        return t("pages.sales.document.status.draft");
                      default:
                        return "N/A";
                    }
                  })()}
                </StatusIcon>
              );
            },
          },
        ]}
        totalItems={getModelCount("Invoice")}
        loadPage={async (indices) => await getDocuments(indices, DocumentType.INVOICE)}
        onClickRow={(item) => navigate(`${item.id}`)}
      />
    </Container>
  );
};

export default Invoices;
