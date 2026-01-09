import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ToastProvider } from "./components/toast/toast.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");
ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </ToastProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
