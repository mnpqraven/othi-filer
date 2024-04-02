"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import { ProcessEventHandlers } from "./eventHandlers";

interface Prop {
  children: ReactNode;
}
export function AppProvider({ children }: Prop) {
  // disables context menu in prod
  if (process.env.NODE_ENV === "production") {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  return (
    <ProcessEventHandlers>
      <ThemeProvider attribute="class">
        <Provider>
          {children}

          <DevTools theme="dark" />
        </Provider>
      </ThemeProvider>
    </ProcessEventHandlers>
  );
}
