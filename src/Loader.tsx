import type { Component } from "solid-js";
import { checkDb } from "@/bindings";
import { useNavigate } from "@solidjs/router";

const Loader: Component = () => {
  const navigate = useNavigate();

  const startup = async () => {
    const data = await checkDb();
    navigate(data === 200 ? "/dashboard" : "/setup");
  };

  startup();

  return (
    <div class="flex justify-center items-center h-screen">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl font-bold">Loading...</h1>
      </div>
    </div>
  );
};

export default Loader;
