import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import { I18nProvider } from "./i18n";
import { Toaster } from "solid-toast";
import Layout from "./components/Core/Layout";
import { lazy } from "solid-js";

const Home = lazy(() => import("./pages/Home"));
const Invoices = lazy(() => import("./pages/Invoices"));

const App: Component = () => {
  return (
    <I18nProvider>
      <Layout>
        <Toaster position="bottom-right" gutter={8} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </Layout>
    </I18nProvider>
  );
};

export default App;
