"use client";

import { FolderOpen } from "lucide-react";
import { type HTMLAttributes, forwardRef, useEffect } from "react";
import { open } from "@tauri-apps/api/dialog";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { useBack, useForward, useList } from "@/hooks/dirAction/useDirAction";
import { useHomeDir } from "@/hooks/useHomeDir";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DirPanel } from "./DirPanel";
import { copyPanelDispatchAtom } from "./_store";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  panelType: "left" | "right";
}
export const Panel = forwardRef<HTMLDivElement, Prop>(function Panel(
  { panelType: side, children: _children, className, ...props },
  ref,
) {
  const [panelConfig, updateConfig] = useAtom(copyPanelDispatchAtom);
  const currentConf = panelConfig[side];
  const path = currentConf.path ?? "";

  const { data: homeData } = useHomeDir();
  const { data: listData } = useList({
    path,
    show_hidden: currentConf.show_hidden,
  });

  const { mutate: back } = useBack({
    onSuccess({ path }) {
      updateConfig({ type: "setPath", payload: { side, to: path } });
    },
  });
  const { mutate: forward } = useForward({
    onSuccess({ path }) {
      updateConfig({ type: "setPath", payload: { side, to: path } });
    },
  });

  useEffect(() => {
    if (homeData) {
      updateConfig({ type: "setPath", payload: { side, to: homeData } });
    }
  }, [homeData, side, updateConfig]);

  async function openFolderSelect() {
    const paths = await open({ directory: true, multiple: false }); // string[] | null
    if (paths) {
      if (!Array.isArray(paths)) {
        updateConfig({ type: "setPath", payload: { side, to: paths } });
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props} ref={ref}>
      <Input value={path} readOnly className="shrink-0" />

      <div className="flex justify-between">
        <Button variant="outline" className="p-2.5" onClick={openFolderSelect}>
          <FolderOpen className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hidden"
            checked={currentConf.show_hidden}
            onCheckedChange={(checked) => {
              const to = checked === "indeterminate" ? false : checked;
              updateConfig({
                type: "setHidden",
                payload: { side, to },
              });
            }}
          />
          <Label htmlFor="hidden">Hidden Files</Label>
        </div>
      </div>
      <DirPanel
        side={side}
        dirs={listData?.children ?? []}
        onBack={() => {
          back({ path });
        }}
        onNameSelect={(to_folder) => {
          forward({ path, to_folder });
        }}
        scrollToTop
      />
    </div>
  );
});
