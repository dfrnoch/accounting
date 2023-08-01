import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import { Toaster } from "solid-toast";
import Layout from "./components/Core/Layout";

import Home from "./pages/Home";
import { I18nProvider } from "./i18n";

const App: Component = () => {
  return (
    <I18nProvider>
      <Layout>
        <Toaster position="bottom-right" gutter={8} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </I18nProvider>
  );
};

export default App;
