import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Side } from "@/bindings/taurpc";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dirItemConf(
  id?: string,
): { side: Side; path: string } | undefined {
  if (!id) return undefined;

  const prefixStripped = id.replace("diritem-selector-", "");
  const dashIndex = prefixStripped.indexOf("-");
  const side = prefixStripped.slice(0, dashIndex) as unknown as Side;
  const path = prefixStripped.slice(dashIndex + 1, prefixStripped.length);
  return { side, path };
}
