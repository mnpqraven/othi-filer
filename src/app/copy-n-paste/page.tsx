"use client";

import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import {
  ContextMenuContainer,
  MENU_CONTEXT,
} from "@/components/ContextMenuContainer";
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
    <div className="flex justify-center gap-4 min-h-0 h-full">
      <Provider store={leftPanelStore}>
        <ContextMenuContainer
          asChild
          context={{ ctx: MENU_CONTEXT.panel, attr: { side: "left" } }}
        >
          <Panel className="w-5/12" />
        </ContextMenuContainer>

        {/* NOTE: move this to debuggin panel */}
        <DevTools theme="dark" position="bottom-left" />
      </Provider>

      <MiddleActionRow className="grow-0 self-center" />

      <Provider store={rightPanelStore}>
        <ContextMenuContainer
          asChild
          context={{ ctx: MENU_CONTEXT.panel, attr: { side: "right" } }}
        >
          <Panel className="w-5/12" />
        </ContextMenuContainer>
      </Provider>
    </div>
  );
}
