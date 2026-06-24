import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ui/Providers";
import Script from "next/script";


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
        {/* <Script id="smartsupp-chat" strategy="afterInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = "9ed28a42b8f0d2dcd0af12c0b8c032da08036ef7"

            window.smartsupp || (function(d) {
              var s, c, o = smartsupp = function() {
                o._.push(arguments);
              };
              
              o._ = [];
              
              s = d.getElementsByTagName('script')[0];
              c = d.createElement('script');
              
              c.type = 'text/javascript';
              c.charset = 'utf-8';
              c.async = true;
              c.src = 'https://www.smartsuppchat.com/loader.js?';
              
              s.parentNode.insertBefore(c, s);
            })(document);
          `}
        </Script> */}
      </body>
    </html>
  );
}
