"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Brain, BarChart3 } from "lucide-react";

const tabs = [
  { href: "/search", label: "Search", icon: Search, description: "Full-text keyword search" },
  { href: "/vector", label: "Vector", icon: Brain, description: "Semantic AI search" },
  { href: "/timeseries", label: "Time Series", icon: BarChart3, description: "Log analytics" },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="flex gap-1" aria-label="Collection types">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                isActive
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="hidden md:inline text-xs text-gray-400 font-normal">
                — {tab.description}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
