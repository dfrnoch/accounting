import { getPrintDocument } from "@/bindings";
import PdfRenderer from "@/shared/components/PdfRenderer";
import { useParams } from "@solidjs/router";
import { Show, Suspense, createResource, type Component } from "solid-js";

const Print: Component = () => {
  const params = useParams<{ readonly id: string }>();

  const [data] = createResource(Number(params.id), getPrintDocument);

  setTimeout(() => {
    window.print();
  }, 1000);

  return (
    <Suspense fallback="Loading...">
      <Show when={!data.loading}>
        <PdfRenderer data={data()} />
      </Show>
    </Suspense>
  );
};

export default Print;
