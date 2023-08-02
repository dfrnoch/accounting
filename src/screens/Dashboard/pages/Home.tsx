import { Component } from "solid-js";
import { useSelector } from "../../../utils/store";

const Home: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-4xl font-bold">Hello, world, {company.name}!</h1>
    </div>
  );
};

export default Home;
