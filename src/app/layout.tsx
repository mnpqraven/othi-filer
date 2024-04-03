import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { AppProvider } from "@/components/providers";

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
          <div className="flex h-screen w-screen flex-col">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
