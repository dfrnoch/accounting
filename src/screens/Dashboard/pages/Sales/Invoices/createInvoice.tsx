import TemplateRenderer from "@/shared/components/PdfRenderer";
import { Hr } from "@/shared/components/Menu/Hr";
import type { Component } from "solid-js";
import PageHeader from "@/screens/Dashboard/components/PageHeader";
import { useI18n } from "@/i18n";

const createInvoice: Component = () => {
  const [t] = useI18n();
  const template = `
  {% assign people = "alice, bob, carol" | split: ", " -%}

  <ul>
  {%- for person in people %}
    <li>
      <a href="{{person | prepend: "http://example.com/"}}">
        {{ person | capitalize }}
      </a>
    </li>
  {%- endfor%}
  </ul>
  
`;

  return (
    <>
      <PageHeader title={[t("sidebar.section.sales"), t("sidebar.button.invoices"), t("pageHeaader.new")]} />
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
    </>
  );
};

export default createInvoice;
