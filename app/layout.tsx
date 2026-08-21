import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Jilid Enam Operations",
  description: "Cafe inventory, receipts, and team operations dashboard"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
