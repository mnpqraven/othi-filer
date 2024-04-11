import { type ComponentPropsWithoutRef } from "react";
import { type Side } from "@/bindings/taurpc";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
