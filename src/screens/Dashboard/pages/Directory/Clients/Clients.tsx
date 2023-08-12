import { useSelector } from "@/store";
import { Component } from "solid-js";

const Clients: Component = () => {
  const {
    companyService: { company },
  } = useSelector();

  return (
    <div class="flex flex-col items-center justify-center h-screen w-full">
      <h1 class="text-4xl font-bold">Klienti</h1>
    </div>
  );
};

export default Clients;
