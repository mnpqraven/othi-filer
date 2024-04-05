"use client";

import { ArrowRightLeft } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { useSetAtom } from "jotai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { copyPanelDispatchAtom } from "./_store";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  hello?: "world";
}
export const MiddleActionRow = forwardRef<HTMLDivElement, Prop>(
  function MiddleActionRow({ className, ...props }, ref) {
    const updateConfig = useSetAtom(copyPanelDispatchAtom);

    return (
      <div {...props} ref={ref} className={cn("", className)}>
        <Button
          variant="outline"
          className="p-2.5"
          onClick={() => {
            updateConfig({ type: "swapSide", payload: null });
          }}
        >
          <ArrowRightLeft />
        </Button>
      </div>
    );
  },
);
