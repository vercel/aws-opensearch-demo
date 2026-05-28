import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from "next/font/google";
import Explanation from "@/components/explanation";

export const metadata: Metadata = {
  title: "OpenSearch Serverless Demo",
  description: "Demonstrating OpenSearch Serverless full-text search.",
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
      <body className={`${geist.className} antialiased bg-white dark:bg-black`}>
        <div className="container mx-auto p-4 max-w-5xl">
          <Explanation />
          {children}
        </div>
      </body>
    </html>
  );
}
