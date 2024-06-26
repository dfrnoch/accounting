import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";
import ManageDocument from "../ManageDocument";
import { DocumentType } from "@/bindings";

const ManageInvoice: Component = () => {
  const params = useParams<{ readonly id?: string }>();

  return <ManageDocument type={DocumentType.INVOICE} id={params.id} url="/dashboard/sales/invoices" />;
};

export default ManageInvoice;
