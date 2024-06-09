import "vite/modulepreload-polyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import { RscDevtoolsExtension } from "./RscDevtoolsExtension.jsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RscDevtoolsExtension />
  </React.StrictMode>,
);
