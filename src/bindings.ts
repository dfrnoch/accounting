import { invoke } from "@tauri-apps/api/primitives";

export function checkDb() {
  return invoke<boolean>("check_db");
}

export function getCompany(id: number | null) {
  return invoke<Company | null>("get_company", { id });
}

export function createPost(data: CreateCompanyData) {
  return invoke<number>("create_company", data);
}
export function getTheme() {
  return invoke<Theme>("get_theme");
}

export type Theme = "light" | "dark";
export type CreateCompanyData = { name: string };
export type Test = { id: number; name: string };
export type Company = {
  id: number;
  name: string;
  email: string;
  cin: string | null;
  vatId: string | null;
  streetAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string | null;
  website: string | null;
};
