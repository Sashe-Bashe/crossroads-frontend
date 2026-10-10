import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Crossroads — Agent commerce, human decisions",
  description:
    "A workspace for product discovery, agent negotiations and human-approved purchasing.",
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
