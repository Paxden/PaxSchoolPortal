import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StudentProvider } from "./context/StudentContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StudentProvider>
    <App />
  </StudentProvider>
);
