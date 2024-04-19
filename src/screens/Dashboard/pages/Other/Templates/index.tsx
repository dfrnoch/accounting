import { getTemplates, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import StatusIcon from "@/screens/Dashboard/components/StatusIcon";

const Templates: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.other"), t("sidebar.button.templates")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Table
        columns={[
          { field: "id", header: "ID" },
          { field: "name", header: t("pages.other.templates.table.name") },
          {
            field: "templateType",
            header: t("pages.other.templates.table.type"),
            component: (item) => (
              <StatusIcon>
                {(item.templateType as string) === "INVOICE"
                  ? t("pages.other.templates.templateTypes.invoice")
                  : (item.templateType as string) === "PROFORMA"
                    ? t("pages.other.templates.templateTypes.proforma")
                    : (item.templateType as string) === "RECEIVE"
                      ? t("pages.other.templates.templateTypes.receive")
                      : "N/A"}
              </StatusIcon>
            ),
          },
        ]}
        totalItems={getModelCount("Template")}
        loadPage={async (indices) => await getTemplates(indices)}
        onClickRow={(item) => navigate(`${item.id}`)}
      />
    </Container>
  );
};

export default Templates;
