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
  useListDir,
  useSetHidden,
  useUiState,
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
  const { data: panelState } = useUiState({ select: (data) => data[side] });
  const { mutate: setHidden } = useSetHidden();

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Input value={panelState?.current_pointer_path ?? ""} readOnly />

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
        <div className="rounded-md h-full border" />
      )}
    </div>
  );
}

const RefreshButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function RefreshButton({ className, children, ...props }, ref) {
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = useUiState({ select: (data) => data[side] });
  const { refetch } = useUpdateState();
  const { refetch: refetchDir } = useListDir({
    path: panelState?.current_pointer_path,
    show_hidden: panelState?.show_hidden,
    side,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={() => {
            void refetch();
            void refetchDir();
          }}
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
  const { data: leftData } = useUiState({ select: (data) => data.left });
  const { data: rightData } = useUiState({ select: (data) => data.right });

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
  const { data: leftData } = useUiState({ select: (data) => data.left });
  const { data: rightData } = useUiState({ select: (data) => data.right });

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
