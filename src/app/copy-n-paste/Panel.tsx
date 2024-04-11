"use client";

import {
  ClipboardCopy,
  ClipboardPaste,
  FolderInput,
  FolderOpen,
  FolderOutput,
  RefreshCw,
} from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";
import { open } from "@tauri-apps/api/dialog";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import {
  usePanelConfig,
  useSetHidden,
  useUpdateCursorPath,
  useUpdateState,
} from "@/hooks/dirAction/useUIAction";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useCopy, useMove } from "@/hooks/dirAction/useFileAction";
import { type Side } from "@/bindings/taurpc";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { panelSideAtom } from "./_store";
import { DirContainer } from "./DirContainer";

type Prop = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export function Panel({ className, ...props }: Prop) {
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = usePanelConfig({ side });

  const { mutate: setHidden } = useSetHidden();

  if (!panelState) return "loading panelstate...";

  const { current_pointer_path, show_hidden } = panelState;

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Input
        value={panelState.current_pointer_path}
        readOnly
        className="shrink-0"
      />

      <div className="flex justify-between">
        <div className="flex gap-2.5 items-center">
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
            checked={show_hidden}
            onCheckedChange={(checked) => {
              const to = checked === "indeterminate" ? false : checked;
              setHidden({ side, to });
            }}
          />
          <Label htmlFor="hidden">Hidden Files</Label>
        </div>
      </div>
      {panelState.current_pointer_path ? (
        <DirContainer
          cursorPath={current_pointer_path}
          scrollToTop
          className="flex-1"
        />
      ) : null}
    </div>
  );
}

const RefreshButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function RefreshButton({ className, children, ...props }, ref) {
  const { refetch } = useUpdateState();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={refetch}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Refresh Directories</TooltipContent>
    </Tooltip>
  );
});

const SelectFolderButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function SelectFolderButton({ className, children, ...props }, ref) {
  const side = useAtomValue(panelSideAtom);
  const { mutate } = useUpdateCursorPath();

  async function openFolderSelect() {
    const path = await open({ directory: true, multiple: false });
    if (path && !Array.isArray(path)) {
      mutate({ side, to: path });
    }
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={openFolderSelect}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Select Folder</TooltipContent>
    </Tooltip>
  );
});

const CopyButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & { side: Side }
>(function CopyButton({ side, className, children, ...props }, ref) {
  const { mutate } = useCopy();
  const { data: leftData } = usePanelConfig({ side: "left" });
  const { data: rightData } = usePanelConfig({ side: "right" });

  function onCopy() {
    if (leftData && rightData) {
      switch (side) {
        case "left": {
          mutate({
            from: leftData.selected_items,
            includes_hidden: leftData.show_hidden,
            strategy: "DepthFirst",
            to: rightData.current_pointer_path,
            includes_wrapping_dir: true,
          });
          break;
        }
        case "right": {
          mutate({
            from: rightData.selected_items,
            includes_hidden: rightData.show_hidden,
            strategy: "DepthFirst",
            to: leftData.current_pointer_path,
            includes_wrapping_dir: true,
          });
          break;
        }
      }
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={onCopy}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy</TooltipContent>
    </Tooltip>
  );
});

const MoveButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function MoveButton({ className, children, ...props }, ref) {
  const { mutate } = useMove();
  const { data: leftData } = usePanelConfig({ side: "left" });
  const { data: rightData } = usePanelConfig({ side: "right" });

  function onMove() {
    if (leftData && rightData) {
      mutate({
        from: leftData.selected_items,
        includes_hidden: leftData.show_hidden,
        strategy: null,
        to: rightData.current_pointer_path,
        includes_wrapping_dir: true,
      });
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={onMove}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Move</TooltipContent>
    </Tooltip>
  );
});
