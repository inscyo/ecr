import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./route";
import { ThemeProvider } from "./context/shadcn-theme-context";
import { ContextProvider } from "./providers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ThemeProvider storageKey="vite-ui-theme">
        <ContextProvider><AppRoutes /></ContextProvider>
    </ThemeProvider>
);
