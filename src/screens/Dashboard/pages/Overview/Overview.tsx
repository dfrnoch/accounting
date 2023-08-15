import { useSelector } from "@/store";
import { Component } from "solid-js";

const Overview: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="">
      <h1 class="">Overview, {company.name}!</h1>
    </div>
  );
};

export default Overview;
