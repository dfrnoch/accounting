import { type Component, createSignal, onMount } from "solid-js";
import { Liquid } from "liquidjs";

interface PdfRendererProps {
  template: string;
  data: Record<string, any>;
}

const TemplateRenderer: Component<PdfRendererProps> = (props) => {
  const [pdfContent, setPdfContent] = createSignal("");

  onMount(async () => {
    const { template, data } = props;

    const engine = new Liquid();
    const renderedContent = await engine.parseAndRender(template, data);

    setPdfContent(renderedContent);
  });

  return <div innerHTML={pdfContent()} />;
};

export default TemplateRenderer;
