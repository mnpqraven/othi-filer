"use client";

import { type ComponentPropsWithoutRef } from "react";
import { type Side } from "@/bindings/taurpc";
import {
  useSetCopyWrappingDir,
  useUiState,
  useUpdateState,
} from "@/hooks/dirAction/useUIAction";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ui/context-menu";

export const MENU_CONTEXT = {
  panel: "panel",
  background: "background",
} as const;

type ContextMap =
  | ContextItem<"panel", { side: Side }>
  | ContextItem<"background", { hello: boolean }>;

interface ContextItem<TKey extends keyof typeof MENU_CONTEXT, K> {
  ctx: TKey;
  attr: K;
}

interface Prop extends ComponentPropsWithoutRef<typeof ContextMenuTrigger> {
  context?: ContextMap;
}
export function ContextMenuContainer({ context, children, ...props }: Prop) {
  const { refetch } = useUpdateState();
  const { data: uiState } = useUiState();
  const { mutate: setCopyWrapping } = useSetCopyWrappingDir();

  if (!context)
    return (
      <ContextMenu>
        <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
      </ContextMenu>
    );

  return (
    <ContextMenu>
      <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset onSelect={refetch}>
          Refresh
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Check All</ContextMenuItem>
        <ContextMenuItem inset>Uncheck All</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Check selecteds by cursor</ContextMenuItem>
        <ContextMenuItem inset>Uncheck selecteds by cursor</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={uiState?.global_config.copy_wrapping_dir}
          onCheckedChange={setCopyWrapping}
        >
          Copy/Move wrapping folder
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
