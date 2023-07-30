import "vite/modulepreload-polyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import { Layout } from "./Layout.jsx";
import { BasicErrorBoundary } from "./BasicErrorBoundary.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <BasicErrorBoundary>
        <App />
      </BasicErrorBoundary>
    </Layout>
  </React.StrictMode>
);
