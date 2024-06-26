import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { AppProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SidebarThumb } from "@/components/SidebarThumb";
import { MenuTopbar } from "@/components/MenuTopbar";
import { ContextMenuContainer } from "@/components/ContextMenuContainer";
import { AppCommandPanel } from "@/components/AppCommandPanel";
import { Sidebar } from "@/components/Sidebar";
import { KeybindHelpDialog } from "@/components/KeybindHelpDialog";

export const metadata: Metadata = {
  title: "Filer",
  description: "Othi's dank file manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <AppProvider>
          <div className="flex h-screen flex-col gap-2 px-4 py-2">
            <div className="flex gap-2">
              <SidebarThumb />
              <MenuTopbar />
            </div>

            {/* why the fuck can't i asChild here */}
            <ContextMenuContainer className="h-full min-h-0">
              {children}
            </ContextMenuContainer>
          </div>

          <Sidebar />

          <AppCommandPanel />
          <KeybindHelpDialog />

          <Toaster />
          <Sonner />
        </AppProvider>
      </body>
    </html>
  );
}
