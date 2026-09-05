import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ui/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Paint Domain",
  description:
    "Nigeria's premier paint and interior solutions company. Quality paints, professional painters, and expert site estimators.",
  keywords:
    "paint, interior design, Nigeria, Paint Domain, painters, estimators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>

        {/* Tawk.to Live Chat */}
        <Script
          id="tawk-to-chat"
          strategy="afterInteractive"
        >
          {`
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();

            (function () {
              var s1 = document.createElement("script");
              var s0 = document.getElementsByTagName("script")[0];

              s1.async = true;
              s1.src = "https://embed.tawk.to/6a9933b1a18d6a34454587cf/default";
              s1.charset = "UTF-8";
              s1.setAttribute("crossorigin", "*");

              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}