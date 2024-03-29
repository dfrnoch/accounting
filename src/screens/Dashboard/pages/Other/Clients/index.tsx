import { Button } from "@/shared/components/Button";
import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";

const Clients: Component = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 class="text-4xl font-bold">Klienti</h1>
      <Button onClick={() => navigate("new")}>Přidat klienta</Button>
      <Button onClick={() => navigate("1")}>Detail klienta</Button>
    </div>
  );
};

export default Clients;
