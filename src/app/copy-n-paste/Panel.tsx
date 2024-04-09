"use client";

import { FolderOpen } from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";
import { open } from "@tauri-apps/api/dialog";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import {
  usePanelConfig,
  useSetHidden,
  useUpdateCursorPath,
} from "@/hooks/dirAction/useUIAction";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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
        <SelectFolderButton>
          <FolderOpen className="h-5 w-5" />
        </SelectFolderButton>

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

const SelectFolderButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function SelectFolderButton({ className, children, ...props }, ref) {
  const side = useAtomValue(panelSideAtom);
  const { mutate } = useUpdateCursorPath();

  async function openFolderSelect() {
    const path = await open({ directory: true, multiple: false }); // string[] | null
    if (path) {
      // TODO:
      if (!Array.isArray(path)) {
        mutate({ side, to: path });
      }
    }
  }
  return (
    <Button
      variant="outline"
      className={cn("p-2.5", className)}
      onClick={openFolderSelect}
      {...props}
      ref={ref}
    >
      {children}
    </Button>
  );
});
