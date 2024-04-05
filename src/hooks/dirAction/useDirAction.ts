"use client";

import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  type ListDirOut,
  type BackIn,
  type ForwardIn,
  type ListDirIn,
} from "@/bindings/taurpc";
import { createRpc } from "@/bindings";

export function useList(
  opt: ListDirIn,
  queryOpt?: UseQueryOptions<
    ListDirOut,
    Error,
    ListDirOut,
    (string | ListDirIn)[]
  >,
) {
  return useQuery({
    queryKey: ["listdir", opt],
    queryFn: async () => {
      const r = await createRpc();
      const res = await r.actions.list_dir(opt);
      return res;
    },
    enabled: Boolean(opt.path),
    ...queryOpt,
  });
}

export function useForward(opt?: {
  onSuccess: UseMutationOptions<ListDirOut, Error, ForwardIn>["onSuccess"];
}) {
  return useMutation({
    mutationKey: ["dirAction", "forward"],
    mutationFn: async (params: ForwardIn) => {
      const rpc = await createRpc();
      return await rpc.actions.forward(params);
    },
    onSuccess: opt?.onSuccess,
  });
}

export function useBack(opt?: {
  onSuccess: UseMutationOptions<ListDirOut, Error, BackIn>["onSuccess"];
}) {
  return useMutation({
    mutationKey: ["dirAction", "back"],
    mutationFn: async (params: BackIn) => {
      const rpc = await createRpc();
      return await rpc.actions.back(params);
    },
    onSuccess: opt?.onSuccess,
  });
}
