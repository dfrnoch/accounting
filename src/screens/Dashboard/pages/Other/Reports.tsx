import type { Component } from "solid-js";
import Container from "../../components/Container";

const Invoices: Component = () => {
  return (
    <Container>
      <div class="flex flex-col items-center justify-center h-screen w-full">
        <h1 class="text-4xl font-bold text-red">reports</h1>
      </div>
    </Container>
  );
};

export default Invoices;
