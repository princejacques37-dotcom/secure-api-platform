import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure API Platform",
  description: "Full-stack security engineering project by Jack Ochieng.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
