import { useSelector } from "@/store";
import { Component } from "solid-js";

const Home: Component = () => {
  const company = useSelector((state) => state.companyService.company);

  return (
    <div class="flex flex-col items-center justify-center h-screen w-full">
      <h1 class="text-4xl font-bold">Hello, world, {company.name}!</h1>
    </div>
  );
};

export default Home;
