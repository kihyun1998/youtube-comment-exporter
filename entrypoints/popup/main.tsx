import React from "react";
import ReactDOM from "react-dom/client";
import "@/lib/i18n";
import App from "./App.tsx";
import "./global.css";

if (!import.meta.env.DEV) {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
