"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/app/store";
import { Button } from "./ui/button";

export function SidebarThumb() {
  const [_sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  return (
    <Button
      variant="outline"
      onClick={() => {
        setSidebarOpen((state) => !state);
      }}
    >
      <ChevronLeftIcon />
    </Button>
  );
}
