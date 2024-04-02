import { type ReactNode } from "react";
import { MenuTopbar } from "@/components/MenuTopbar";
import { SidebarThumb } from "@/components/SidebarThumb";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
      <SidebarThumb />
      <MenuTopbar />
      </div>
      {children}
    </div>
  );
}
