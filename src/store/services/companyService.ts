import { getCompany, type Company } from "@/bindings";
import { createStore } from "solid-js/store";

const companyStore = createStore<Company>({} as Company);

export const CompanyService = () => {
  const [company, setCompany] = companyStore;

  const updateCompany = async () => {
    setCompany(await getCompany());
  };

  return { company, updateCompany };
};
