import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next App",
  description: "An independent Next.js starter",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
