import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRpc } from "@/bindings";
import { type CopyRequest } from "@/bindings/taurpc";
import { useUpdateState } from "./useUIAction";

export function useCopy() {
  const { refetch } = useUpdateState();
  return useMutation({
    mutationKey: ["file", "copy"],
    mutationFn: async (params: CopyRequest) => {
      const t = await createRpc();
      return await t.actions.file.copy(params);
    },
    onSuccess: async () => {
      await refetch();
      toast.success("Files copied successfully");
    },
  });
}

export function useMove() {
  const { refetch } = useUpdateState();
  return useMutation({
    mutationKey: ["file", "move"],
    mutationFn: async (params: CopyRequest) => {
      const t = await createRpc();
      return await t.actions.file.moves(params);
    },
    onSuccess: async () => {
      await refetch();
      toast.success("Files moved successfully");
    },
  });
}
