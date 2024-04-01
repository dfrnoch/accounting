import { invoke } from "@tauri-apps/api/core";
import type { Indicies } from "./screens/Dashboard/components/Table";
import { StateService } from "./store/services/stateService";

const currentCompany = () => {
  const state = StateService();
  return state.state.companyId;
};

export function checkDb() {
  return invoke<200 | 400>("check_db");
}

export function getInvoices(indicies: Indicies) {
  return invoke<Invoice[]>("get_invoices", { companyId: currentCompany(), indicies });
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
  return await invoke<Template[]>("get_templates", { companyId: 1, indicies });
}

export async function saveTemplate(template: Template) {
  return await invoke<Template>("save_template", { template });
}

export async function getTemplate(id: number) {
  return await invoke<Template>("get_template", { id });
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

export type Invoice = {};

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

export enum TemplateType {
  Invoice = 0,
  Estimate = 1,
  Receipt = 2,
}

export type Template = {
  id: number;
  type: TemplateType;
  html: string;
};
