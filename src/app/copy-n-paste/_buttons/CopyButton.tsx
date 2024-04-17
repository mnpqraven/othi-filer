import { type HTMLAttributes, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Side } from "@/bindings/taurpc";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopy } from "@/hooks/dirAction/useFileAction";
import { uiStateQuery } from "@/hooks/dirAction/useUIAction";
import { cn } from "@/lib/utils";

export const CopyButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & { side: Side }
>(function CopyButton({ side, className, children, ...props }, ref) {
  const { mutate } = useCopy();
  const { data: leftData } = useQuery({
    ...uiStateQuery,
    select: ({ left }) => left,
  });
  const { data: rightData } = useQuery({
    ...uiStateQuery,
    select: ({ right }) => right,
  });

  function onCopy() {
    if (leftData && rightData) {
      switch (side) {
        case "left": {
          mutate({
            from: leftData.selected_items,
            includes_hidden: leftData.show_hidden,
            strategy: "DepthFirst",
            to: rightData.current_pointer_path,
            includes_wrapping_dir: true,
          });
          break;
        }
        case "right": {
          mutate({
            from: rightData.selected_items,
            includes_hidden: rightData.show_hidden,
            strategy: "DepthFirst",
            to: leftData.current_pointer_path,
            includes_wrapping_dir: true,
          });
          break;
        }
      }
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={onCopy}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy</TooltipContent>
    </Tooltip>
  );
});
