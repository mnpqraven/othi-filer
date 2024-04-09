"use client";

import { ArrowRightLeft } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSwapSides } from "@/hooks/dirAction/useDirAction";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  hello?: "world";
}
export const MiddleActionRow = forwardRef<HTMLDivElement, Prop>(
  function MiddleActionRow({ className, ...props }, ref) {
    const { mutate: swapSide } = useSwapSides();

    return (
      <div {...props} ref={ref} className={cn("", className)}>
        <Button
          variant="outline"
          className="p-2.5"
          onClick={() => {
            swapSide();
          }}
        >
          <ArrowRightLeft />
        </Button>
      </div>
    );
  },
);
