import { invoke } from "@tauri-apps/api/core";
import type { Indicies } from "./screens/Dashboard/components/Table";
import { StateService } from "./store/services/stateService";

export function checkDb() {
  return invoke<200 | 400>("check_db");
}

export function getInvoices(indicies: Indicies) {
  return invoke<Invoice[]>("get_invoices", { companyId: StateService().state.companyId, indicies });
}

export function getCompany(id: number | null) {
  return invoke<Company | null>("get_company", { id });
}

export function createCompany(data: CreateCompanyData) {
  return invoke<Company>("create_company", { data });
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

// TODO
export async function deleteTemplate(id: number) {
  return await invoke("delete_template", { id });
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

export interface Invoice {
  id: number;
  number: string;
  clientId: number;
  templateId: string;
  currency: string;
  issueDate: Date;
  taxDate: Date;
  dueDate: Date;
  status: string;
  items: InvoiceItem[];
  companyId: number;
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  price: number;
  tax: number;
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
  type: "INVOICE" | "ESTIMATE" | "RECEIPT";
  html: string;
  companyId: number;
};
