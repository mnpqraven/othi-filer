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
import { ProcessEventHandlers } from "./eventHandlers";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
    mutations: {
      onError(error) {
        // safe hardcast as soon as rust' error struct remains unchanged
        const { kind, message } = error as unknown as AppErrorIpc;
        toast.error(kind, {
          description: message,
        });
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
    <ProcessEventHandlers>
      <ThemeProvider attribute="class">
        <QueryClientProvider client={queryClient}>
          <Provider>
            {children}

            <DevTools theme="dark" />
            <ReactQueryDevtools initialIsOpen={false} />
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </ProcessEventHandlers>
  );
}
