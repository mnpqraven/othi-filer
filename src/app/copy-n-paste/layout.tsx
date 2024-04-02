import { type ReactNode } from "react";
import { MenuTopbar } from "@/components/MenuTopbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <MenuTopbar />
      {children}
    </div>
  );
}
