import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from "next/font/google";
import { TabNavigation } from "@/components/tab-navigation";

export const metadata: Metadata = {
  title: "OpenSearch Serverless Demo",
  description:
    "Demonstrating all three OpenSearch Serverless collection types: Search, Vector, and Time Series.",
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
          <header className="mb-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              OpenSearch Serverless Demo
            </h1>
            <p className="text-xs text-gray-500">
              Three collection types — one app
            </p>
          </header>
          <TabNavigation />
          {children}
        </div>
      </body>
    </html>
  );
}
