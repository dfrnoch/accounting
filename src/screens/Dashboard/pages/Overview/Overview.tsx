import { useSelector } from "@/store";
import { Component } from "solid-js";

const Overview: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="flex flex-col items-center justify-center h-screen w-full">
      <h1 class="text-4xl font-bold">Overview, {company.name}!</h1>
    </div>
  );
};

export default Overview;
