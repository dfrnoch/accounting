import { type Component, createSignal, onMount } from "solid-js";
import { Liquid } from "liquidjs";
import type { GetPrintDocumentResult } from "@/bindings";
import { format } from "date-fns";

interface PdfRendererProps {
  data: GetPrintDocumentResult | undefined;
}

const PdfRenderer: Component<PdfRendererProps> = (props) => {
  const [pdfContent, setPdfContent] = createSignal("");

  onMount(async () => {
    const { data } = props;
    console.log(data);
    if (!data) {
      return;
    }

    // Format dates to DD.MM.YYYY
    const formattedData = {
      ...data,
      issueDate: format(new Date(data.issueDate), "dd.MM.yyyy"),
      dueDate: format(new Date(data.dueDate), "dd.MM.yyyy"),
    };

    const engine = new Liquid();
    const renderedContent = await engine.parseAndRender(data.template.html, formattedData);
    setPdfContent(renderedContent);
  });

  return <div class="print" innerHTML={pdfContent()} />;
};

export default PdfRenderer;
