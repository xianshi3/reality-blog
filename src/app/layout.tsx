import type { Metadata } from "next";
import { Geist, Geist_Mono, Russo_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const russoOne = Russo_One({
  variable: "--font-title",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Reality Blog",
    template: "%s | Reality Blog",
  },
  description: "Reality 的个人技术博客：探索技术与世界的边界",
  applicationName: "Reality Blog",
  keywords: ["blog", "技术博客", "Reality", "Next.js", "前端", "后端", "全栈"],
  authors: [{ name: "Reality", url: "https://github.com/xianshi3" }],
  creator: "Reality",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "Reality Blog",
    title: "Reality Blog",
    description: "Reality 的个人技术博客：探索技术与世界的边界",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Reality Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reality Blog",
    description: "Reality 的个人技术博客：探索技术与世界的边界",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || theme === 'light') {
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } else {
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', prefersDark);
                  localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className="antialiased">
      {children}
      </body>
    </html>
  );
}
