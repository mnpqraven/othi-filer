import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { AppProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"

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
          {children}

          <Toaster />
          <Sonner />
        </AppProvider>
      </body>
    </html>
  );
}
