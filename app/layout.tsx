import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Crossroads | Procurement workspace",
  description: "Discover suppliers. Scope work. Approve with confidence.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
