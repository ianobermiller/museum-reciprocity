import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "./lib/theme";

const elem = document.getElementById("root");
if (!elem) throw new Error("Root element not found");

const app = (
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="museum-finder-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
