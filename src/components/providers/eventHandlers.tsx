import { type ReactNode } from "react";

/**
 * This wrapper component modifies event handlers inherited from tauri and webviews
 */
export function ProcessEventHandlers({ children }: { children: ReactNode }) {
  // disables context menu in prod
  if (process.env.NODE_ENV === "production") {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  return children;
}
