import { getClients, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";

const Clients: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

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
          { field: "name", header: t("pages.other.clients.table.name") },
          { field: "cin", header: t("pages.other.clients.table.cin") },
          { field: "email", header: "Email" },
          { field: "phone", header: t("pages.other.clients.table.phone") },
        ]}
        totalItems={getModelCount("Client")}
        loadPage={getClients}
        onClickRow={(item) => navigate(`detail/${item.id}`)}
      />
    </Container>
  );
};

export default Clients;
