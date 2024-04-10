import { useMutation } from "@tanstack/react-query";
import { createRpc } from "@/bindings";
import { type CopyRequest } from "@/bindings/taurpc";

export function useCopy() {
  return useMutation({
    mutationKey: ["file", "copy"],
    mutationFn: async (params: CopyRequest) => {
      const t = await createRpc();
      return await t.actions.file.copy(params);
    },
  });
}

export function useMove() {
  return useMutation({
    mutationKey: ["file", "move"],
    mutationFn: async (params: CopyRequest) => {
      const t = await createRpc();
      return await t.actions.file.moves(params);
    },
  });
}
