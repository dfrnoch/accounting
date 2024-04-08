import { useI18n } from "@/i18n";
import Container from "@/screens/Dashboard/components/Container";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import HeaderButton from "@/screens/Dashboard/components/PageHeader/HeaderButton";
import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";

const ManageClient: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  const [t] = useI18n();

  return (
    <Container>
      <PageHeader
        title={[t("sidebar.section.sales"), t("sidebar.button.clients"), params.id ? params.id : t("pageHeaader.new")]}
        actionElements={[
          <HeaderButton onClick={() => {}} buttonType="primary">
            Save
          </HeaderButton>,
        ]}
      />
    </Container>
  );
};

export default ManageClient;
