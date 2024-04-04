"use client";

import { ArrowRightLeft } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  hello?: "world";
}
export const MiddleActionRow = forwardRef<HTMLDivElement, Prop>(
  function MiddleActionRow({ className, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cn("", className)}>
        <Button
          variant="outline"
          className="p-2.5"
          onClick={() => {
            toast("wip");
          }}
        >
          <ArrowRightLeft />
        </Button>
      </div>
    );
  },
);
