"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeDir() {
  return useQuery({
    queryKey: ["homeDir"],
    queryFn: async () => getHomeDirPath(),
  });
}

async function getHomeDirPath() {
  const { homeDir } = await import("@tauri-apps/api/path");
  const home = await homeDir();
  return { home };
}
