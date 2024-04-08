import { useParams } from "@solidjs/router";
import type { Component } from "solid-js";

const ManageClient: Component = () => {
  const params = useParams<{ readonly id?: string }>();
  return (
    <div>
      <h1 class="text-4xl font-bold">Create Client</h1>
    </div>
  );
};

export default ManageClient;
