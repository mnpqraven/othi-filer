"use client";

import { Provider } from "jotai";
import {
  ContextMenuContainer,
  MENU_CONTEXT,
} from "@/components/ContextMenuContainer";
import { PanelEventHandlers } from "@/components/providers/eventHandlers/panel";
import { Panel } from "./Panel";
import { MiddleActionRow } from "./MiddleActionRow";
import { leftPanelStore, rightPanelStore } from "./_store";

/**
 * TODO:
 * - move menubar to outer layouts if needed
 * - move sidebar thumb to outer layouts, conditional rendering with viewport
 *   size ??
 */
export default function Page() {
  return (
    <div className="flex h-full min-h-0 justify-center gap-4">
      <Provider store={leftPanelStore}>
        <PanelEventHandlers store={leftPanelStore}>
          <ContextMenuContainer
            asChild
            context={{ ctx: MENU_CONTEXT.panel, attr: { side: "left" } }}
          >
            <Panel className="w-5/12" />
          </ContextMenuContainer>
        </PanelEventHandlers>
      </Provider>

      <MiddleActionRow className="grow-0 self-center" />

      <Provider store={rightPanelStore}>
        <PanelEventHandlers store={rightPanelStore}>
          <ContextMenuContainer
            asChild
            context={{ ctx: MENU_CONTEXT.panel, attr: { side: "right" } }}
          >
            <Panel className="w-5/12" />
          </ContextMenuContainer>
        </PanelEventHandlers>
      </Provider>
    </div>
  );
}
