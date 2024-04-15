"use client";

import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  type ToggleExpandRequest,
  type ToggleHiddenRequest,
  type DirItem,
  type ListDirRequest,
  type Side,
  type DirActionPanel,
  type UpdatePathRequest,
  type SelectRequest,
  type CopyUiState,
} from "@/bindings/taurpc";
import { createRpc } from "@/bindings";

export function useUpdateState() {
  const client = useQueryClient();
  const refetch = () =>
    client.refetchQueries({ queryKey: ["data", "app_state"] });
  const update = (to: CopyUiState) =>
    client.setQueriesData({ queryKey: ["data", "app_state"] }, to);
  return { refetch, update };
}

export function useUiState() {
  return useQuery({
    queryKey: ["data", "app_state"],
    queryFn: async () => {
      const r = await createRpc();
      return await r.data.get_state();
    },
  });
}

export function usePanelConfig(
  { side }: { side: Side },
  queryOpt?: Partial<
    UseQueryOptions<CopyUiState, Error, DirActionPanel, unknown[]>
  >,
) {
  return useQuery({
    queryKey: ["data", "app_state", side],
    select: (data) => data[side],
    ...queryOpt,
    queryFn: async () => {
      const r = await createRpc();
      return await r.data.get_state();
    },
  });
}

export function useListDir(
  { path, show_hidden, side }: Partial<ListDirRequest>,
  opt?: Partial<UseQueryOptions<DirItem[], Error, DirItem[]>>,
) {
  return useQuery({
    enabled:
      Boolean(path?.length) && show_hidden !== undefined && Boolean(side),
    ...opt,
    queryKey: ["actions", "list_dir", { path, show_hidden }],
    queryFn:
      path && side
        ? async () => {
            const r = await createRpc();
            return await r.actions.ui.list_dir({
              path,
              show_hidden: show_hidden ?? false,
              side,
            });
          }
        : skipToken,
    placeholderData: keepPreviousData,
  });
}

export function useToggleExpand() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "toggle_expand"],
    mutationFn: async (param: ToggleExpandRequest) => {
      const r = await createRpc();
      return await r.actions.ui.toggle_expand(param);
    },
    onSuccess: update,
  });
}

export function useSetHidden() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "set_hidden"],
    mutationFn: async (params: ToggleHiddenRequest) => {
      const r = await createRpc();
      return await r.actions.ui.toggle_hidden(params);
    },
    onSuccess: update,
  });
}

export function useUpdateCursorPath() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "update_cursor"],
    mutationFn: async (params: UpdatePathRequest) => {
      const r = await createRpc();
      return await r.actions.ui.update_cursor_path(params);
    },
    onSuccess: update,
  });
}

export function useForward() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "forward"],
    mutationFn: async (params: UpdatePathRequest) => {
      const r = await createRpc();
      return await r.actions.ui.forward(params);
    },
    onSuccess: update,
  });
}

export function useBack() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "back"],
    mutationFn: async (params: Side) => {
      const r = await createRpc();
      return await r.actions.ui.back(params);
    },
    onSuccess: update,
  });
}

export function useSelect() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "select"],
    mutationFn: async (params: SelectRequest) => {
      const r = await createRpc();
      return await r.actions.ui.select(params);
    },
    onSuccess: update,
  });
}

export function useSwapSides() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "swap_sides"],
    mutationFn: async () => {
      const r = await createRpc();
      return await r.actions.ui.swap_sides();
    },
    onSuccess: update,
  });
}

export function useSetCopyWrappingDir() {
  const { update } = useUpdateState();
  return useMutation({
    mutationKey: ["actions", "copy_wrapping_dir"],
    mutationFn: async (to?: boolean) => {
      const r = await createRpc();
      return await r.actions.ui.set_copy_wrapping_dir(to ?? null);
    },
    onSuccess: update,
  });
}
