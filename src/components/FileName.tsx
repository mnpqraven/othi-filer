import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Prop = HTMLAttributes<HTMLDivElement> & { path: string };

/**
 * supports name truncation
 * NOTE: parent div will need min-w-0
 */
export const FileName = forwardRef<HTMLDivElement, Prop>(function FileName(
  { path: short_path, className, ...props },
  ref,
) {
  const extIndex = short_path.lastIndexOf(".");
  const ext = short_path.slice(extIndex, short_path.length);
  const nameNoext = ext ? short_path.slice(0, extIndex) : short_path;

  return (
    <div className={cn("flex min-w-0", className)} ref={ref} {...props}>
      <span className="text-ellipsis whitespace-nowrap overflow-hidden select-none">
        {nameNoext}
      </span>
      <span className="shrink-0">{ext}</span>
    </div>
  );
});
