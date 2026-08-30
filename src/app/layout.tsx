import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "BuildBridge — Verified Contractors, Suppliers & Developers",
  description:
    "BuildBridge connects developers with licensed contractors, backed by verified project history.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
