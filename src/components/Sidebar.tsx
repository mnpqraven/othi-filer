"use client";

import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/app/store";
import {
  useSetCopyWrappingDir,
  useUiState,
} from "@/hooks/dirAction/useUIAction";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Switch } from "./ui/switch";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const { data: uiState } = useUiState();
  const { mutate: setCopyWrapping } = useSetCopyWrappingDir();

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filer</SheetTitle>
          <SheetDescription>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Copy wrapping directories</span>
                <Switch
                  checked={uiState?.global_config.copy_wrapping_dir}
                  onCheckedChange={setCopyWrapping}
                />
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
