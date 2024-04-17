"use client";

import { ArrowRightLeft } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSwapSides } from "@/hooks/dirAction/useUIAction";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MiddleActionRow = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function MiddleActionRow({ className, ...props }, ref) {
  const { mutate: swapSide } = useSwapSides();

  return (
    <div {...props} ref={ref} className={cn("", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2.5"
            onClick={() => {
              swapSide();
            }}
          >
            <ArrowRightLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Swap sides</TooltipContent>
      </Tooltip>
    </div>
  );
});
