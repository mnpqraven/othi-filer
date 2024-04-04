import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  name?: string;
}
/**
 * supports name truncation
 * NOTE: parent div will need min-w-0
 */
export const FileName = forwardRef<HTMLDivElement, Prop>(function FileName(
  { name, className, ...props },
  ref,
) {
  const extIndex = name?.lastIndexOf(".");
  const ext = name?.slice(extIndex, name.length);
  const nameNoext = ext ? name?.slice(0, extIndex) : name;

  return (
    <div className={cn("flex min-w-0", className)} ref={ref} {...props}>
      <span className="text-ellipsis whitespace-nowrap overflow-hidden">
        {nameNoext}
      </span>
      <span className="shrink-0">{ext}</span>
    </div>
  );
});
