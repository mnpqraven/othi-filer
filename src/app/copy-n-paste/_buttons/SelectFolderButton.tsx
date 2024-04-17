import { useAtomValue } from "jotai";
import { type HTMLAttributes, forwardRef } from "react";
import { open } from "@tauri-apps/api/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateCursorPath } from "@/hooks/dirAction/useUIAction";
import { panelSideAtom } from "../_store";

export const SelectFolderButton = forwardRef<
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
