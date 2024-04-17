import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";
import ManageDocument from "../ManageDocument";
import { DocumentType } from "@/bindings";

const ManageReceived: Component = () => {
  const params = useParams<{ readonly id?: string }>();

  return <ManageDocument type={DocumentType.RECEIVE} id={params.id} url="/dashboard/sales/received" />;
};

export default ManageReceived;
