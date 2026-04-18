import { createRoot } from "react-dom/client";
import { getRouter } from "./router";

declare global {
  interface ImportMetaEnv {
    readonly VITE_ALLOW_LOCALHOST: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const router = getRouter();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(<router.RouterProvider router={router} />);
