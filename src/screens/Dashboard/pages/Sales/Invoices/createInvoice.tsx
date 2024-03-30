import TemplateRenderer from "@/shared/components/PdfRenderer";
import { Hr } from "@/shared/components/Menu/Hr";
import type { Component } from "solid-js";

const createInvoice: Component = (props) => {
  const template = `
  <main class="bg-white h-full px-6">
    <!-- Invoice Header -->
    <header class="py-6 flex text-sm text-gray-900 border-b">

      <!-- Company Contacts -->
      <section class="w-1/3">
        <div>{{ email }}</div>
        <div class="mt-1">{{ phone }}</div>
      </section>

  </main>
`;

  return (
    <div class="flex flex-col lg:flex-row w-full gap-5 ">
      <div class="w-full lg:w-1/2 flex flex-col">
        <div class="flex items h-full bg-green">cuspus</div>
        <div class="h-20 bg-green-300">cuspus</div>
      </div>

      <div class="w-full lg:w-1/2 bg-red rounded-xl gap-4 flex flex-col p-4">
        <h1 class="text-xl font-bold">Invoice Preview</h1>
        <Hr />
        <TemplateRenderer template={template} data={{ email: "joe@aa.cz", phone: "12122212" }} />
      </div>
    </div>
  );
};

export default createInvoice;
