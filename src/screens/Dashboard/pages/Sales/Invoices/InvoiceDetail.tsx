import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";

const InvoiceDetail: Component = () => {
  const params = useParams<{ readonly id: string }>();
  console.log(params.id);
  return (
    <div>
      <h1 class="text-4xl font-bold">Detail faktury {params.id}</h1>
    </div>
  );
};

export default InvoiceDetail;
