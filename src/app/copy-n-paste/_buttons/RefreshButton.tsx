import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useAtomValue } from "jotai";
import { type HTMLAttributes, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  uiStateQuery,
  useListDir,
  useUpdateState,
} from "@/hooks/dirAction/useUIAction";
import { cn } from "@/lib/utils";
import { panelSideAtom } from "../_store";

export const RefreshButton = forwardRef<
  HTMLButtonElement,
  Omit<HTMLAttributes<HTMLButtonElement>, "onClick">
>(function RefreshButton({ className, children, ...props }, ref) {
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = useQuery({
    ...uiStateQuery,
    select: (data) => data[side],
  });
  const { refetch } = useUpdateState();
  const { refetch: refetchDir } = useListDir({
    path: panelState?.current_pointer_path,
    show_hidden: panelState?.show_hidden,
    side,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn("p-2.5", className)}
          onClick={() => {
            void refetch();
            void refetchDir();
          }}
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Refresh Directories</TooltipContent>
    </Tooltip>
  );
});
