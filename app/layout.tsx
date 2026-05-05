import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "ForgeLine Fasteners",
  description:
    "B2B fastener ecommerce for military and aerospace programs with searchable parts, RFQs, account tools, and certification-ready fulfillment."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
