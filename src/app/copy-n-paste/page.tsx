"use client";

import { Provider } from "jotai";
import { SidebarThumb } from "@/components/SidebarThumb";
import { MenuTopbar } from "@/components/MenuTopbar";
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
    <div className="flex flex-col h-screen px-4 py-2 gap-2">
      <div className="flex gap-2">
        <SidebarThumb />
        <MenuTopbar />
      </div>

      <div className="flex justify-center gap-4 min-h-0 h-full">
        <Provider store={leftPanelStore}>
          <Panel className="w-5/12" />
        </Provider>

        <MiddleActionRow className="grow-0 self-center" />

        <Provider store={rightPanelStore}>
          <Panel className="w-5/12" />
        </Provider>
      </div>
    </div>
  );
}
