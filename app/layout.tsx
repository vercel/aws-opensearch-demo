import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "OpenSearch Recipe Search",
  description:
    "Full-text recipe search with faceted filtering powered by Amazon OpenSearch Service.",
};

const geist = Geist_Mono({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body className={`${geist.className} antialiased bg-white dark:bg-black`}>
        {children}
      </body>
    </html>
  );
}
