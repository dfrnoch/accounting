import type { Component } from "solid-js";
import { checkDb } from "@/bindings";
import { useNavigate } from "@solidjs/router";
import LoadingIcon from "./shared/components/LoadingIcon";

const Loader: Component = () => {
  const navigate = useNavigate();

  const startup = async () => {
    const data = await checkDb();
    navigate(data === 200 ? "/dashboard" : "/setup");
  };

  startup();

  return <LoadingIcon />;
};

export default Loader;
