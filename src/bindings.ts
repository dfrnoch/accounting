import { invoke } from "@tauri-apps/api/core";
import type { Indicies } from "./screens/Dashboard/components/Table";
import { StateService } from "./store/services/stateService";

export function checkDb() {
  return invoke<200 | 400>("check_db");
}

export type GetDocumentData = {
  id: number;
  number: string;
  clientId: number;
  templateId: string;
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
}

export function getDocuments(documentType: DocumentType, indicies: Indicies) {
  return invoke<GetDocumentData[]>("get_documents", {
    companyId: StateService().state.companyId,
    documentType,
    indicies,
  });
}
export function getDocument(id: number) {
  return invoke<Document>("get_document", { id });
}

export function updateDocument(data: Document) {
  return invoke<Document>("update_document", { data });
}

export function deleteDocument(id: number) {
  return invoke("delete_document", { id });
}

export function createDocument(data: Document) {
  return invoke("create_document", { data });
}

export function getClients(indicies: Indicies) {
  return invoke<GetClientData[]>("get_clients", { companyId: StateService().state.companyId, indicies });
}

export function getClient(id: number) {
  return invoke<Client>("get_client", { id });
}
export function updateClient(data: Client) {
  return invoke<Client>("update_client", { data });
}
export function deleteClient(id: number) {
  return invoke("delete_client", { id });
}

export function getCompany(id: number | null) {
  return invoke<Company | null>("get_company", { id });
}

export function createCompany(data: CreateCompanyData) {
  return invoke<Company>("create_company", { data });
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

export function createClient(data: ManageClientData) {
  return invoke("create_client", { data: { ...data, companyId: StateService().state.companyId } });
}

export function migrateAndPopulate() {
  return invoke("migrate_and_populate");
}

export async function getCompanies(exclude?: number) {
  return await invoke<Company[]>("get_companies", { exclude });
}

export async function getTemplates(indicies: Indicies) {
  return await invoke<Template[]>("get_templates", { companyId: StateService().state.companyId, indicies });
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
  return await invoke<number>("template_count", { companyId: StateService().state.companyId });
}

export async function createTemplate(template: {
  templateType: "INVOICE" | "ESTIMATE" | "RECEIPT";
  html: string;
  name: string;
}) {
  return await invoke("create_template", { companyId: StateService().state.companyId, data: template });
}

export async function updateTemplate(id: number, html: string) {
  return await invoke("update_template", { id, html });
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
  templateId: string;
  currency: string;
  issueDate: Date;
  taxDate: Date;
  dueDate: Date;
  status: string;
  items: DocumentItem[];
  companyId: number;
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
