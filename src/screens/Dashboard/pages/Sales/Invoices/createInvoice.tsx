import { Hr } from "@/shared/components/Menu/Hr";
import type { Component } from "solid-js";

const createInvoice: Component = (props) => {
  return (
    <div class="flex flex-col lg:flex-row w-full gap-5 ">
      <div class="w-full lg:w-1/2 bg-green">
        <div class="flex items">cuspus</div>
      </div>

      <div class="w-full lg:w-1/2 bg-red rounded-xl gap-4 flex flex-col p-4">
        <h1 class="text-xl font-bold">Invoice Preview</h1>
        <Hr />
        <div class="h-500px bg-black" />
      </div>
    </div>
  );
};

export default createInvoice;
