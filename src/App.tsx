import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import { Toaster } from "solid-toast";
import Layout from "./components/Core/Layout";

import Home from "./pages/Home";

const App: Component = () => {
  return (
    <Layout>
      <Toaster position="bottom-right" gutter={8} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
};

export default App;
