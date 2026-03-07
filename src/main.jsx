// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ToastProvider } from "./contexts/ToastContext.jsx";
// import "./index.css";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AuthProvider>
//       <ToastProvider>
//         <App />
//       </ToastProvider>
//     </AuthProvider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext.jsx"; // ✅ Import CurrencyProvider
import { ToastProvider } from "./contexts/ToastContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <CurrencyProvider>
          {" "}
          {/* ✅ Wrap inside CurrencyProvider */}
          <App />
        </CurrencyProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
