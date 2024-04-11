"use client";

import { type ComponentPropsWithoutRef } from "react";
import { type Side } from "@/bindings/taurpc";
import { useUpdateState } from "@/hooks/dirAction/useUIAction";
import {
  ContextMenu,
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
        <ContextMenuItem onSelect={refetch}>Refresh</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Check All</ContextMenuItem>
        <ContextMenuItem>Check selecteds by cursor</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Uncheck All</ContextMenuItem>
        <ContextMenuItem>Uncheck selecteds by cursor</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
