import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import StatBox from "@/screens/Dashboard/components/StatBox";
import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";

const ClientDetail: Component = () => {
  const params = useParams<{ readonly id: string }>();
  const [t] = useI18n();

  return (
    <Container>
      <PageHeader title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id]} />
      <div class="flex flex-row gap-3 lg:gap-4 justify-between items-center w-full ">
        <StatBox title={t("overview.stats.purchase")} value={1654.43} last={6804.52} />
        <StatBox title={t("overview.stats.sales")} value={100} />
        <StatBox title={t("overview.stats.tax")} value={120} />
      </div>
    </Container>
  );
};

export default ClientDetail;
