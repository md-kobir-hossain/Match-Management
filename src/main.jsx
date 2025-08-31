// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global CSS / Libraries
import "bootstrap/dist/css/bootstrap.min.css";

// Import Main App Component
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
