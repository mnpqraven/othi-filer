import { useQuery } from "@tanstack/react-query";
import { platform } from "@tauri-apps/api/os";

export function useSystem() {
  return useQuery({
    queryKey: ["system"],
    queryFn: async () => platform(),
  });
}
