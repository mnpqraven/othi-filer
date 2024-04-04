"use client";

import { FolderOpen } from "lucide-react";
import { type HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { Button } from "@/components/ui/button";
import { useBack, useForward, useList } from "@/hooks/dirAction/useDirAction";
import { useHomeDir } from "@/hooks/useHomeDir";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DirPanel } from "./DirPanel";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  panelType: "left" | "right";
}
export const Panel = forwardRef<HTMLDivElement, Prop>(function Panel(
  { panelType: _, children: _children, className, ...props },
  ref,
) {
  const [path, setPath] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const { data: homeData } = useHomeDir();
  const { data: listData } = useList({ path, show_hidden: hidden });

  const { mutate: back } = useBack({
    onSuccess({ path }) {
      setPath(path);
    },
  });
  const { mutate: forward } = useForward({
    onSuccess({ path }) {
      setPath(path);
    },
  });

  useEffect(() => {
    if (homeData) setPath(homeData);
  }, [homeData]);

  async function openFolderSelect() {
    const selectedPaths = await open({ directory: true, multiple: false }); // string[] | null
    if (selectedPaths) {
      if (!Array.isArray(selectedPaths)) setPath(selectedPaths);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props} ref={ref}>
      <Input value={path ?? ""} readOnly />
      <div className="flex justify-between">
        <Button variant="outline" className="p-2.5" onClick={openFolderSelect}>
          <FolderOpen className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hidden"
            onCheckedChange={(checked) => {
              setHidden(checked === "indeterminate" ? false : checked);
            }}
          />
          <Label htmlFor="hidden">Hidden Files</Label>
        </div>
      </div>
      <DirPanel
        dirs={listData?.children ?? []}
        onBack={() => {
          if (path) back({ path });
        }}
        onNameSelect={(to_folder) => {
          if (path) forward({ path, to_folder });
        }}
      />
      {/* <div id="selected-block" className="h-24 rounded-md border">
        {pathList.map((path, index) => (
          <PathLine path={path} name={path} key={`${path}-${index}`} />
        ))}
      </div> */}
    </div>
  );
});
