import type { Company } from "@/bindings";
import { onMount } from "solid-js";
import { createStore } from "solid-js/store";

const companyStore = createStore<Company>({} as Company);

export const CompanyService = () => {
  const [company, setCompany] = companyStore;

  onMount(() => {
    setCompany(() => ({}) as Company);
  });

  const updateCompany = (company: Company) => {
    setCompany(() => company);
  };

  return { company, updateCompany };
};
