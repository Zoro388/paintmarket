import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ui/Providers";

export const metadata: Metadata = {
  title: "Paint Domain & Primary | Interior Builders",
  description:
    "Nigeria's premier paint and interior solutions company. Quality paints, professional painters, and expert site estimators.",
  keywords: "paint, interior design, Nigeria, Paint Domain, painters, estimators",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
