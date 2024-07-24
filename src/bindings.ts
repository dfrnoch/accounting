import { invoke } from "@tauri-apps/api/core";
import type { Indicies } from "./screens/Dashboard/components/Table";
import { stateStore } from "./store/services/stateService";

const [state, _] = stateStore;

export async function checkDb() {
  return invoke<200 | 400>("check_db");
}

export type GetDocumentsData = {
  totalPrice: number;
  id: number;
  number: string;
  documentType: "INVOICE" | "PROFORMA" | "RECEIVE";
  client: string;
  templateId: number;
  currency: string;
  issueDate: string;
  status: string;
};

export type GetClientData = {
  id: number;
  cin: string;
  name: string;
  email: string;
  phone: string;
};

export enum DocumentType {
  INVOICE = "INVOICE",
  PROFORMA = "PROFORMA",
  RECEIVE = "RECEIVE",
}

export async function getDocuments(indicies: Indicies, documentType?: DocumentType, clientId?: number) {
  return await invoke<GetDocumentsData[]>("get_documents", {
    companyId: state.companyId,
    documentType,
    clientId,
    indicies,
  });
}

export type ManageDocumentData = {
  id?: number;
  number: string;
  clientId: number;
  templateId: number;
  documentType: DocumentType;
  currencyId: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  items: DocumentItem[];
};

export async function getDocument(id: number) {
  return invoke<Document>("get_document", { id });
}

export async function updateDocument(data: ManageDocumentData) {
  return invoke("update_document", { data });
}

export async function deleteDocument(id: number) {
  return invoke("delete_document", { id });
}

export async function createDocument(data: ManageDocumentData) {
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

export async function getCompany(id?: number) {
  return invoke<Company>("get_company", { id: id ? id : state.companyId });
}

export async function deleteCompany(id: number) {
  return invoke("delete_company", { id });
}

export async function createCompany(data: ManageCompanyData) {
  return invoke<number>("create_company", { data });
}

export async function updateCompany(data: ManageCompanyData) {
  return invoke("update_company", { id: state.companyId, data });
}

export async function getDocumentStats(months: number, documentType: DocumentType) {
  return invoke<number[]>("get_documents_stats", { companyId: state.companyId, months, documentType });
}
export async function getSales(data: { months: number; clientId?: number }) {
  return invoke<number[]>("get_sales", { companyId: state.companyId, months: data.months, clientId: data.clientId });
}

export async function getExpenses(data: { months: number; clientId?: number }) {
  return invoke<number[]>("get_expenses", { companyId: state.companyId, months: data.months, clientId: data.clientId });
}

export async function getSalesAndExpenses(data: { months: number; clientId?: number }) {
  return invoke<number[]>("get_sales_and_expenses", {
    companyId: state.companyId,
    months: data.months,
    clientId: data.clientId,
  });
}

export async function getModelCount(
  model: "Invoice" | "Proforma" | "Receive" | "Company" | "Client" | "Template" | "Currency",
) {
  return await invoke<number>("get_model_count", { companyId: state.companyId, model });
}

export async function getDocumentCount(documentType?: DocumentType, clientId?: number) {
  return await invoke<number>("get_document_count", { documentType, clientId });
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
export async function validateCompanyPassword(id: number, password: string) {
  return await invoke<boolean>("validate_company_password", { id, password });
}

export async function getTemplates(indicies: Indicies, templateType?: "INVOICE" | "PROFORMA" | "RECEIVE") {
  return await invoke<Template[]>("get_templates", { companyId: state.companyId, indicies, templateType });
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

export type ManageTemplateData = {
  templateType: "INVOICE" | "PROFORMA" | "RECEIVE";
  html: string;
  name: string;
};

export async function createTemplate(template: ManageTemplateData) {
  return await invoke("create_template", { companyId: state.companyId, data: template });
}

export async function updateTemplate(id: number, data: ManageTemplateData) {
  return await invoke("update_template", { id, data });
}

export async function getCurrency(id: string) {
  return await invoke<Currency>("get_currency", { id });
}

export async function getCurrencies(indicies: Indicies) {
  return await invoke<Currency[]>("get_currencies", { companyId: state.companyId, indicies });
}

export async function createCurrency(data: { name: string; code: string; rate: number }) {
  return await invoke("create_currency", { companyId: state.companyId, data });
}

export async function updateCurrency(id: string, data: { name: string; code: string; rate: number }) {
  return await invoke("update_currency", { id, data });
}

export async function deleteCurrency(id: string) {
  return await invoke("delete_currency", { id });
}

export async function getSettings(id?: number) {
  return await invoke<Settings>("get_settings", { companyId: id ? id : state.companyId });
}

export async function updateSettings(data: ManageSettingsData) {
  return await invoke("update_settings", { companyId: state.companyId, data });
}

export async function getPrintDocument(id: number) {
  return await invoke<GetPrintDocumentResult>("get_print_document", { id });
}

export type ManageSettingsData = {
  defaultCurrencyId: string;
  defaultTemplateId: number;
  invoicePrefix: string;
  proformaPrefix: string;
  receivePrefix: string;

  invoiceCounter: number;
  proformaCounter: number;
  receiveCounter: number;
};

export type Settings = {
  id: number;
  defaultCurrency: Currency;
  defaultTemplate: Template;

  invoicePrefix: string;
  invoiceCounter: number;

  proformaPrefix: string;
  proformaCounter: number;

  receivePrefix: string;
  receiveCounter: number;
};

export type Currency = {
  id: string;
  name: string;
  code: string;
  rate: number;
  companyId: number;
};

export type ManageCompanyData = {
  name: string;
  cin: string;
  vatId?: string;
  address: string;
  city: string;
  zip: string;
  phone?: string;
  email?: string;

  bankAccount?: string;
  bankIban?: string;

  password?: string;
  passwordConfirmation?: string;
};

export interface Document {
  id: number;
  number: string;
  clientId: number;
  templateId: number;
  currencyId: string;
  documentType: "INVOICE" | "PROFORMA" | "RECEIVE";
  issueDate: string;
  dueDate: string;
  status: string;
  items: DocumentItem[];
}

export interface DocumentItem {
  id?: number;
  documentId?: number;
  description: string;
  quantity: number;
  price: number;
}

export type Company = {
  id: number;
  name: string;
  cin: string | null;
  vatId: string | null;
  address: string;
  city: string;
  zip: string;
  phone: string | null;
  email: string | null;

  bankAccount: string | null;
  bankIban: string | null;

  isProtected: boolean;
};

export type Template = {
  id: number;
  templateType: "INVOICE" | "PROFORMA" | "RECEIVE";
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

  bankAccount?: string;
  bankIban?: string;
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
  };
  template: {
    id: number;
    name: string;
    html: string;
    templateType: string;
    companyId: number;
  };
  company: {
    name: string;
    cin: string;
    vatId: string;
    street: string;
    city: string;
    zip: string;
    phoneNumber: string;
    email: string;
  };
  currency: {
    id: string;
    name: string;
    code: string;
    rate: number;
    companyId: number;
  };
  issueDate: Date;
  dueDate: Date;
  status: string;
  items: {
    id: number;
    documentId: number;
    description: string;
    quantity: number;
    price: number;
    // tax: number;
  }[];
  companyId: number;
};
