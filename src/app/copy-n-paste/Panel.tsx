"use client";
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { Button } from "@/components/ui/button";
import { usePathTraverse } from "@/hooks/usePathTraverse";
import { PathLine } from "./PathLine";

export function Panel({ panelType }: { panelType: "left" | "right" }) {
  const [pathList, setPathList] = useState<string[]>([]);

  const { listQuery, path, back, forward } = usePathTraverse();

  async function openFolderSelect() {
    const selectedPaths = await open({ directory: true, multiple: true }); // string[] | null
    if (selectedPaths) {
      if (Array.isArray(selectedPaths)) setPathList(selectedPaths);
      else setPathList([selectedPaths]);
    }
  }

  return (
    <div className="flex flex-1 grow flex-col gap-2">
      Path: {path}
      <div>
        <Button variant="outline" className="p-2.5" onClick={openFolderSelect}>
          <FolderOpen className="h-5 w-5" />
        </Button>
      </div>
      <div id="explorer" className="flex grow flex-col rounded-md border">
        <div
          className="cursor-pointer"
          onClick={() => {
            back();
          }}
        >
          ..
        </div>
        <div>
          {listQuery.data?.children.map(({ path, name }) => (
            <div
              className="cursor-pointer"
              onClick={() => {
                forward({ pathName: path });
              }}
              key={path}
            >
              <PathLine path={path} name={name} key={path} />
            </div>
          ))}
        </div>
      </div>
      <div id="selected-block" className="h-24 rounded-md border">
        {pathList.map((path) => (
          <PathLine path={path} key={path} />
        ))}
      </div>
    </div>
  );
}
