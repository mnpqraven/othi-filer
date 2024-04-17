import { type HTMLAttributes, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMove } from "@/hooks/dirAction/useFileAction";
import { cn } from "@/lib/utils";
import { uiStateQuery } from "@/hooks/dirAction/useUIAction";

export const MoveButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function MoveButton({ className, children, ...props }, ref) {
  const { mutate } = useMove();
  const { data: leftData } = useQuery({
    ...uiStateQuery,
    select: ({ left }) => left,
  });
  const { data: rightData } = useQuery({
    ...uiStateQuery,
    select: ({ right }) => right,
  });

  function onMove() {
    if (leftData && rightData) {
      mutate({
        from: leftData.selected_items,
        includes_hidden: leftData.show_hidden,
        strategy: null,
        to: rightData.current_pointer_path,
        includes_wrapping_dir: true,
      });
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={onMove}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Move</TooltipContent>
    </Tooltip>
  );
});
