import { queryOptions, useQuery } from "@tanstack/react-query";
import { createRpc } from "@/bindings";

export const driveQuery = queryOptions({
  queryKey: ["data", "drives"],
  queryFn: async () => {
    const t = await createRpc();
    return await t.data.get_windows_drives();
  },
});

export function useDrives() {
  return useQuery({
    queryKey: ["data", "drives"],
    queryFn: async () => {
      const t = await createRpc();
      return await t.data.get_windows_drives();
    },
  });
}
