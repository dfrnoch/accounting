import { type Component, createSignal, onMount } from "solid-js";
import { render } from "solid-js/web";

interface PdfRendererProps {
  template: string;
}

const PdfRenderer: Component<PdfRendererProps> = (props) => {
  const [pdfContent, setPdfContent] = createSignal("");

  onMount(() => {
    const { template } = props;

    // Replace placeholders in the template with actual data
    // let content = template;
    // Object.entries(data).forEach(([key, value]) => {
    //   content = content.replace(new RegExp(`{{${key}}}`, "g"), String(value));
    // });

    setPdfContent(template);
  });

  return <div innerHTML={pdfContent()} />;
};

export default PdfRenderer;
