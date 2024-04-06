import { type Template, getTemplates } from "@/bindings";
import { useI18n } from "@/i18n";
import Table, { type Indicies } from "@/screens/Dashboard/components/Table";
import { FiEdit, FiPlus, FiTrash } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { Button } from "@/shared/components/Button";

const Clients: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  const loadPage = async (indices: Indicies) => {
    const data = await getTemplates(indices);
    console.log(data);
    return data;
  };

  const columns = [
    { field: "id", header: "ID" },
    { field: "name", header: "Name" },
    { field: "templateType", header: "Type" },
  ];

  const handleEdit = (item: Template) => {
    navigate(`${item.id}`);
  };

  const handleDelete = (item: Template) => {
    console.log("Delete:", item);
    // Handle delete action
  };

  const rowActions = [
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
        title={[t("sidebar.section.other"), t("sidebar.button.templates")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Button onClick={() => navigate("new")}>Přidat klienta</Button>
      <Button onClick={() => navigate("1")}>Detail klienta</Button>
      <Table columns={columns} totalItems={10} loadPage={loadPage} rowActions={rowActions} />
    </Container>
  );
};

export default Clients;
