"use client";

import { useQuery } from "@tanstack/react-query";
import { createRpc } from "@/bindings";

export function useHomeDir() {
  return useQuery({
    queryKey: ["homeDir"],
    queryFn: async () => {
      const rpc = await createRpc();
      return await rpc.data.home_dir();
    },
  });
}
