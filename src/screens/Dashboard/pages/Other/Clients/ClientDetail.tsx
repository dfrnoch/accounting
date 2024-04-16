import { getClients } from "@/bindings";
import { useI18n } from "@/i18n";
import Box from "@/screens/Dashboard/components/Box";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import StatBox from "@/screens/Dashboard/components/StatBox";
import Table from "@/screens/Dashboard/components/Table";
import { useNavigate, useParams } from "@solidjs/router";
import type { Component } from "solid-js";

const ClientDetail: Component = () => {
  const params = useParams<{ readonly id: string }>();
  const navigate = useNavigate();
  const [t] = useI18n();

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id]}
        actionElements={[
          <HeaderButton onClick={() => navigate(`/dashboard/other/clients/${params.id}`)} buttonType="primary">
            Edit
          </HeaderButton>,
        ]}
      />
      <div class="grid grid-cols-3 gap-3 lg:gap-4 justify-between items-center w-full ">
        <StatBox title={t("overview.stats.sales")} value={100} />
        <StatBox title={t("overview.stats.expenses")} value={1654.43} last={6804.52} />
      </div>
      <div class="grid grid-cols-6 h-full mt-4 gap-3 lg:gap-4">
        <div class="col-span-4">
          <Table
            columns={[
              { field: "id", header: "ID" },
              { field: "name", header: "Name" },
            ]}
            totalItems={Promise.resolve(10)}
            allowedCounts={[10]}
            loadPage={getClients}
          />
        </div>
        <Box class="col-span-2">ddd</Box>
      </div>
    </Container>
  );
};

export default ClientDetail;
