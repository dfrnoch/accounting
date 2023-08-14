import { useSelector } from "@/store";
import { Component } from "solid-js";

const Overview: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  return (
    <div>
      <h1 class="text-4xl font-bold">Overview, {company.name}!</h1>
    </div>
  );
};

export default Overview;
