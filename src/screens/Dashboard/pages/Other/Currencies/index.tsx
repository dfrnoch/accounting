import { getCurrencies, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";

const Currencies: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.other"), t("sidebar.button.currencies")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Table
        columns={[
          { field: "name", header: t("pages.other.currencies.table.name") },
          { field: "code", header: t("pages.other.currencies.table.code") },
          { field: "rate", header: t("pages.other.currencies.table.rate") },
        ]}
        totalItems={getModelCount("Currency")}
        loadPage={getCurrencies}
        onClickRow={(item) => navigate(item.id)}
      />
    </Container>
  );
};

export default Currencies;
