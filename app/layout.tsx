import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jack Ochieng — Software, Systems & Security",
  description: "Engineering portfolio of Jack Ochieng: software engineering, systems, security, DevSecOps and cloud security.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
