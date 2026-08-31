import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { TenderProvider } from "./context/TenderContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TenderProvider>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#003366",
              color: "#FFFFFF",
              fontWeight: "500",
            },
            success: {
              style: {
                background: "#16A34A",
              },
            },
            error: {
              style: {
                background: "#DC2626",
              },
            },
          }}
        />

        {/* Main Application */}
        <App />
      </TenderProvider>
    </BrowserRouter>
  </React.StrictMode>
);