import { type Template, getTemplates, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiEdit, FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import StatusIcon from "@/screens/Dashboard/components/StatusIcon";

const Templates: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  const handleEdit = (item: Template) => {
    navigate(`${item.id}`);
  };

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
          { field: "name", header: "Name" },
          {
            field: "templateType",
            header: "Type",
            component: (item) => <StatusIcon>{item.templateType}</StatusIcon>,
          },
        ]}
        totalItems={getModelCount("Template")}
        loadPage={async (indices) => await getTemplates(indices)}
        rowActions={[
          {
            onClick: handleEdit,
            icon: FiEdit,
          },
        ]}
      />
    </Container>
  );
};

export default Templates;
