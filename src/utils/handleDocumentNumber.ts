export function generateDocumentNumber(template: string, documentNumber: number): string {
  const currentYear = new Date().getFullYear();
  const shortYear = currentYear % 100;

  let documentString = template.replace(/{FULL_YEAR}/g, currentYear.toString());

  documentString = documentString.replace(/{YEAR}/g, shortYear.toString());

  const documentNumberPlaceholder = documentString.match(/X+/)?.[0];

  if (documentNumberPlaceholder) {
    const placeholderLength = documentNumberPlaceholder.length;

    const paddedDocumentNumber = documentNumber.toString().padStart(placeholderLength, "0");

    documentString = documentString.replace(/X+/, paddedDocumentNumber);
  } else {
    documentString += documentNumber;
  }

  return documentString;
}
