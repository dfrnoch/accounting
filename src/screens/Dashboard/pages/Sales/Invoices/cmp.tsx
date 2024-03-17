import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const MyComponent = () => {
  let componentElement: HTMLDivElement | undefined;

  const generatePDF = async (el: HTMLDivElement | undefined) => {
    const doc = new jsPDF();
    if (!el) return;

    const canvas = await html2canvas(el);
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save("component.pdf");
  };

  return (
    <div>
      <div ref={componentElement}>
        <h1>My Component</h1>
        <p>This is the content of my component.</p>
      </div>
      <button
        onClick={() => {
          generatePDF(componentElement);
        }}
      >
        Generate PDF
      </button>
    </div>
  );
};

export default MyComponent;
