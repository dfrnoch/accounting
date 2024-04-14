import { invoke } from "@tauri-apps/api/core";
import type { Indicies } from "./screens/Dashboard/components/Table";
import { stateStore } from "./store/services/stateService";

const [state, _] = stateStore;

export async function checkDb() {
  return invoke<200 | 400>("check_db");
}

export type GetDocumentData = {
  id: number;
  number: string;
  clientId: number;
  templateId: number;
  currency: string;
  issueDate: Date;
  status: string;
};

export type GetClientData = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export enum DocumentType {
  INVOICE = "INVOICE",
  PROFORMA = "PROFORMA",
  RECIEVE = "RECIEVE",
  TEMPLATE = "TEMPLATE",
}

export async function getDocuments(documentType: DocumentType, indicies: Indicies) {
  return invoke<GetDocumentData[]>("get_documents", {
    companyId: state.companyId,
    documentType,
    indicies,
  });
}

export async function getDocument(id: number) {
  return invoke<Document>("get_document", { id });
}

export async function updateDocument(data: Document) {
  return invoke<Document>("update_document", { data });
}

export async function deleteDocument(id: number) {
  return invoke("delete_document", { id });
}

export async function createDocument(data: Document) {
  return invoke("create_document", { data: { ...data, companyId: state.companyId } });
}

export async function getClients(indicies: Indicies) {
  return invoke<GetClientData[]>("get_clients", { companyId: state.companyId, indicies });
}

export async function getClient(id: number) {
  return invoke<Client>("get_client", { id });
}
export async function updateClient(data: Client) {
  return invoke<Client>("update_client", { data });
}
export async function deleteClient(id: number) {
  return invoke("delete_client", { id });
}

export async function getCompany(id: number | null) {
  return invoke<Company | null>("get_company", { id });
}

export async function createCompany(data: CreateCompanyData) {
  return invoke<Company>("create_company", { data });
}

export async function getSales(months: number) {
  return invoke<number[]>("get_sales", { companyId: state.companyId, months });
}

export async function getExpenses(months: number) {
  return invoke<number[]>("get_expenses", { companyId: state.companyId, months });
}

export async function getSalesAndExpenses(months: number) {
  return invoke<number[]>("get_sales_and_expenses", { companyId: state.companyId, months });
}

export async function getModelCount(
  model: "Invoice" | "Proforma" | "Recieve" | "Company" | "Client" | "Template" | "Currency",
) {
  return await invoke<number>("get_model_count", { companyId: state.companyId, model });
}

type ManageClientData = {
  id?: number;
  name: string;
  cin: string;
  vatId?: string;
  address: string;
  city: string;
  clientType: "SUPPLIER" | "CUSTOMER" | "BOTH";
  zip: string;
  email?: string;
  phone?: string;
};

export async function createClient(data: ManageClientData) {
  return invoke("create_client", { data: { ...data, companyId: state.companyId } });
}

export async function migrateAndPopulate() {
  return invoke("migrate_and_populate");
}

export async function getCompanies(exclude?: number) {
  return await invoke<Company[]>("get_companies", { exclude });
}

export async function getTemplates(indicies: Indicies) {
  return await invoke<Template[]>("get_templates", { companyId: state.companyId, indicies });
}

export async function saveTemplate(template: Template) {
  return await invoke<Template>("save_template", { template });
}

export async function getTemplate(id: number) {
  return await invoke<Template>("get_template", { id });
}

export async function deleteTemplate(id: number) {
  return await invoke("delete_template", { id });
}

export async function templateCount() {
  return await invoke<number>("template_count", { companyId: state.companyId });
}

export async function createTemplate(template: {
  templateType: "INVOICE" | "ESTIMATE" | "RECEIPT";
  html: string;
  name: string;
}) {
  return await invoke("create_template", { companyId: state.companyId, data: template });
}

export async function updateTemplate(id: number, html: string) {
  return await invoke("update_template", { id, html });
}
export async function getPrintDocument(id: number) {
  return await invoke<GetPrintDocumentResult>("get_print_document", { id });
}

export type CreateCompanyData = {
  name: string;
  cin: string;
  vatId: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
};

export interface Document {
  id: number;
  number: string;
  clientId: number;
  templateId: number;
  currency: string;
  issueDate: Date;
  taxDate: Date;
  dueDate: Date;
  status: string;
  items: DocumentItem[];
}

export interface DocumentItem {
  id?: number;
  documentId?: number;
  description: string;
  quantity: number;
  price: number;
  tax?: number;
}

export type Company = {
  id: number;
  name: string;
  cin: string | null;
  vatId: string | null;
  street: string;
  city: string;
  postalCode: string;
  phoneNumber: string | null;
  email: string | null;
};

export type Template = {
  id: number;
  templateType: "INVOICE" | "ESTIMATE" | "RECEIPT";
  name: string;
  html: string;
  companyId: number;
};

export type Client = {
  id: number;
  name: string;
  cin: string;
  vatId?: string;
  address: string;
  city: string;
  clientType: "SUPPLIER" | "CUSTOMER" | "BOTH";
  zip: string;
  email?: string;
  phone?: string;
  invoices?: Document[];
};

export type GetPrintDocumentResult = {
  id: number;
  number: string;
  documentType: string;
  client: {
    id: number;
    clientType: string;
    name: string;
    cin: string;
    vatId: string | null;
    address: string;
    city: string;
    zip: string;
    email: string | null;
    phone: string | null;
    companyId: number;
  };
  template: {
    id: number;
    name: string;
    html: string;
    templateType: string;
    companyId: number;
  };
  currency: {
    id: string;
    name: string;
    code: string;
    rate: number;
    companyId: number;
  };
  issueDate: Date;
  taxDate: Date;
  dueDate: Date;
  status: string;
  items: {
    id: number;
    documentId: number;
    description: string;
    quantity: number;
    price: number;
    tax: number;
  }[];
  companyId: number;
};
