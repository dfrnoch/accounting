import { DocumentType, getDocuments, getModelCount } from "@/bindings";
import { useI18n } from "@/i18n";
import Table from "@/screens/Dashboard/components/Table";
import { FiPlus } from "solid-icons/fi";
import type { Component } from "solid-js";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import Container from "@/screens/Dashboard/components/Container";
import { useNavigate } from "@solidjs/router";
import { useSelector } from "@/store";

const ReceivedInvoices: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  const settings = useSelector((state) => state.settingsService.settings);
  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.receivedInvoices")]}
        actionElements={[
          <HeaderButton onClick={() => navigate("new")} buttonType="primary">
            <FiPlus class="stroke-2" />
          </HeaderButton>,
        ]}
      />
      <Table
        columns={[
          { field: "number", header: "Number" },
          {
            field: "totalPrice",
            header: "Total Price",
            component: (item) => (
              <>
                {item.totalPrice} {settings.defaultCurrency.code}
              </>
            ),
          },
        ]}
        totalItems={getModelCount("Receive")}
        loadPage={async (indices) => await getDocuments(indices, DocumentType.RECEIVE)}
        onClickRow={(item) => navigate(`${item.id}`)}
      />
    </Container>
  );
};

export default ReceivedInvoices;
