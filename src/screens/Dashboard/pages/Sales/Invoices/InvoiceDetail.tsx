import { useI18n } from "@/i18n";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";

const InvoiceDetail: Component = () => {
  const params = useParams<{ readonly id: string }>();
  const [t] = useI18n();

  return (
    <>
      <PageHeader title={[t("sidebar.section.sales"), t("sidebar.button.invoices"), params.id]} />
      <h1 class="text-4xl font-bold">Detail faktury {params.id}</h1>
    </>
  );
};

export default InvoiceDetail;
