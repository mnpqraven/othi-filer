import { useAtomValue } from "jotai";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { driveQuery } from "@/hooks/data";
import { useUpdateCursorPath } from "@/hooks/dirAction/useUIAction";
import { panelSideAtom } from "../_store";

export const WindowsDriveSelector = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof SelectTrigger>
>(function WindowsDriveSelector({ ...props }, ref) {
  // NOTE: will err on linux
  const { data } = useQuery(driveQuery);
  const side = useAtomValue(panelSideAtom);
  const { mutate } = useUpdateCursorPath();

  function onDriveChange(to: string) {
    mutate({ side, to });
  }

  if (!data) return null;

  return (
    <Select onValueChange={onDriveChange}>
      <SelectTrigger {...props} ref={ref}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {data.map((drive) => (
          <SelectItem value={drive} key={drive}>
            {drive}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
