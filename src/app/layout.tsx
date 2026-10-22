import type { Metadata, Viewport } from "next";
import { Comfortaa, Nunito } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { SITE_URL, BASE_PATH } from "@/lib/env";
import { pageMetadata, personLd, websiteLd } from "@/lib/seo";

const nunito = Nunito({ subsets: ["latin", "cyrillic"], variable: "--font-nunito", display: "swap" });
const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-comfortaa",
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}${BASE_PATH}/`),
  ...pageMetadata({ path: "/" }),
  title: { default: site.title, template: `%s · ${site.name}` },
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#eef1f7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${nunito.variable} ${comfortaa.variable}`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-60 rounded-full bg-white px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Перейти к содержимому
        </a>
        <JsonLd data={{ ...websiteLd(), about: personLd() }} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
