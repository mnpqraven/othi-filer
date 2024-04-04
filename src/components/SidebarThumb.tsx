"use client";

import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function SidebarThumb() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        toast("WIP");
      }}
    >
      <ChevronLeftIcon />
    </Button>
  );
}
