"use client";

import {
  ClipboardCopy,
  ClipboardPaste,
  FolderInput,
  FolderOpen,
  FolderOutput,
  RefreshCw,
} from "lucide-react";
import { type HTMLAttributes } from "react";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { uiStateQuery, useSetHidden } from "@/hooks/dirAction/useUIAction";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { panelSideAtom } from "./_store";
import { DirContainer } from "./DirContainer";
import { WindowsDriveSelector } from "./_buttons/WindowsDriveSelector";
import { RefreshButton } from "./_buttons/RefreshButton";
import { SelectFolderButton } from "./_buttons/SelectFolderButton";
import { CopyButton } from "./_buttons/CopyButton";
import { MoveButton } from "./_buttons/MoveButton";

type Prop = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export function Panel({ className, ...props }: Prop) {
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = useQuery({
    ...uiStateQuery,
    select: (data) => data[side],
  });
  const { mutate: setHidden } = useSetHidden();

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex gap-2">
        <WindowsDriveSelector />

        <Input value={panelState?.current_pointer_path ?? ""} readOnly />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-2.5">
          <SelectFolderButton>
            <FolderOpen className="h-5 w-5" />
          </SelectFolderButton>

          <RefreshButton>
            <RefreshCw className="h-5 w-5" />
          </RefreshButton>

          <CopyButton side={side}>
            {side === "left" ? (
              <ClipboardPaste className="h-5 w-5" />
            ) : (
              <ClipboardCopy className="h-5 w-5" />
            )}
          </CopyButton>

          <MoveButton>
            {side === "left" ? (
              <FolderInput className="h-5 w-5" />
            ) : (
              <FolderOutput className="h-5 w-5" />
            )}
          </MoveButton>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hidden"
            checked={panelState?.show_hidden}
            onCheckedChange={(checked) => {
              const to = checked === "indeterminate" ? false : checked;
              setHidden({ side, to });
            }}
          />
          <Label htmlFor="hidden">Hidden Files</Label>
        </div>
      </div>
      {panelState?.current_pointer_path ? (
        <DirContainer
          cursorPath={panelState.current_pointer_path}
          scrollToTop
          className="flex-1"
        />
      ) : (
        <div className="h-full rounded-md border" />
      )}
    </div>
  );
}
