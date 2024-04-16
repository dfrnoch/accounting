import { type Currency, getCurrencies, getModelCount } from "@/bindings";
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
          { field: "name", header: "Name" },
          { field: "code", header: "Code" },
          { field: "rate", header: "Rate" },
        ]}
        totalItems={getModelCount("Currency")}
        loadPage={getCurrencies}
        onClickRow={(item) => navigate(item.code)}
      />
    </Container>
  );
};

export default Currencies;
