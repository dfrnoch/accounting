import { type Component, createSignal, onMount } from "solid-js";
import { Liquid } from "liquidjs";
import type { GetPrintDocumentResult } from "@/bindings";

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

    const engine = new Liquid();
    const renderedContent = await engine.parseAndRender(data.template.html, data);

    setPdfContent(renderedContent);
  });

  return <div class="bg-white text-black w-screen h-screen" innerHTML={pdfContent()} />;
};

export default PdfRenderer;
