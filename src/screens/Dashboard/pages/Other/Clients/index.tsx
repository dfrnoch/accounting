import { type GetClientData, getClients, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table, { type Indicies } from "@/screens/Dashboard/components/Table";
import { FiEdit, FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";

const Clients: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  const loadPage = async (indices: Indicies) => {
    return await getClients(indices);
  };

  const handleEdit = (item: GetClientData) => {
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
        title={[t("sidebar.section.other"), t("sidebar.button.clients")]}
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
          { field: "email", header: "Email" },
          { field: "phone", header: "Phone" },
        ]}
        totalItems={getModelCount("Client")}
        loadPage={loadPage}
        rowActions={rowActions}
      />
    </Container>
  );
};

export default Clients;
