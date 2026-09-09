import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { useAuthStore } from "@/store/authStore";

export default function Root() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <App />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
            fontSize: "0.875rem",
          },
        }}
      />
    </BrowserRouter>
  );
}
