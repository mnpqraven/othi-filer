"use client";

import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import {
  QueryClient,
  type QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { type AppErrorIpc } from "@/bindings/taurpc";
import { TooltipProvider } from "../ui/tooltip";
import { RootEventHandlers } from "./eventHandlers/root";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: {
      onError(error) {
        // safe hardcast as soon as rust' error struct remains unchanged
        if ("message" in error) {
          const { kind, message } = error as unknown as AppErrorIpc;
          toast.error(kind, {
            description: message,
          });
        }
      },
    },
  },
};

interface Prop {
  children: ReactNode;
}
export function AppProvider({ children }: Prop) {
  // disables context menu in prod

  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));

  return (
    <TooltipProvider delayDuration={300}>
      <ThemeProvider attribute="class">
        <QueryClientProvider client={queryClient}>
          <Provider>
            <RootEventHandlers>
              {children}

              {/* NOTE: comment this if using devtools inside panel */}
              <DevTools theme="dark" />
              <ReactQueryDevtools initialIsOpen={false} />
            </RootEventHandlers>
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
