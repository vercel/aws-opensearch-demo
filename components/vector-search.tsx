"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Brain, Tag, Calendar } from "lucide-react";
import type { VectorSearchResult } from "@/lib/vector/queries";

interface Props {
  initialQuery: string;
  result: VectorSearchResult | null;
}

// Color name → CSS color mapping
const colorMap: Record<string, string> = {
  Cream: "#FFFDD0",
  "Light Blue": "#ADD8E6",
  Oatmeal: "#D4C5A9",
  White: "#FFFFFF",
  Black: "#1a1a1a",
  Navy: "#001F3F",
  Ivory: "#FFFFF0",
  Charcoal: "#36454F",
  Cognac: "#9A463D",
  Emerald: "#50C878",
  "Midnight Blue": "#191970",
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Crystal: "#A7D8DE",
  "Washed Black": "#3D3D3D",
  Olive: "#808000",
  Rust: "#B7410E",
  Lilac: "#C8A2C8",
  "Floral Multi": "#FF69B4",
  Tan: "#D2B48C",
  "Dusty Rose": "#DCAE96",
  Brown: "#8B4513",
  Natural: "#F5F5DC",
  "Heather Grey": "#B6B6B4",
  Camel: "#C19A6B",
  "Navy Stripe": "#001F3F",
  Sage: "#BCB88A",
  Coral: "#FF7F50",
  Blush: "#DE5D83",
  Terracotta: "#E2725B",
  Teal: "#008080",
  Tortoiseshell: "#704214",
  Khaki: "#C3B091",
  "Dark Green": "#013220",
  Burgundy: "#800020",
  Indigo: "#3F0071",
  Sand: "#C2B280",
  "Dark Brown": "#3B2F2F",
  "Medium Blue": "#4682B4",
  Stone: "#928E85",
  "Vintage Blue": "#5B7FA3",
  "Forest Green": "#228B22",
  Yellow: "#FFD700",
  "Cream/Green": "#F5F5DC",
};

// Style → color mapping for badges
const styleColors: Record<string, { bg: string; text: string; border: string }> = {
  Casual: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  Professional: { bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700" },
  Evening: { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  Streetwear: { bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  Bohemian: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  Minimalist: { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
  Athletic: { bg: "bg-green-50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  Resort: { bg: "bg-cyan-50 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-800" },
};

// Category → emoji
const categoryIcons: Record<string, string> = {
  Tops: "👕",
  Bottoms: "👖",
  Dresses: "👗",
  Shoes: "👟",
  Outerwear: "🧥",
  Accessories: "👜",
};

const exampleQueries = [
  "casual outfit for a coffee date in autumn",
  "professional look for a tech conference",
  "beach vacation vibes, colorful and flowy",
  "edgy streetwear for a concert",
  "elegant evening outfit for a cocktail party",
  "cozy winter layers for staying warm",
  "minimalist everyday essentials",
  "sporty outfit for morning jog then brunch",
];

export function VectorSearchInterface({ initialQuery, result }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/vector?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleExample(q: string) {
    setQuery(q);
    router.push(`/vector?q=${encodeURIComponent(q)}`);
  }

  // Get max score for normalizing the match bars
  const maxScore = result?.items[0]?.score || 1;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Brain className="absolute left-3 w-4 h-4 text-purple-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="pl-9 text-base bg-white dark:bg-gray-950 text-black dark:text-white focus:border-purple-500 dark:border-gray-700 w-full"
          />
        </div>
      </form>

      {/* Example queries - always visible */}
      <div className="space-y-2">
        {result && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Try another query:</p>
            <button
              onClick={() => {
                setQuery("");
                router.push("/vector");
              }}
              className="text-xs px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 transition-colors"
            >
              ✕ Clear
            </button>
          </div>
        )}
        {!result && (
          <p className="text-xs text-gray-500">
            Try these natural language queries:
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((q) => (
            <button
              key={q}
              onClick={() => handleExample(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 hover:text-purple-600 dark:hover:border-purple-700 dark:hover:text-purple-400 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {result.total} item{result.total !== 1 ? "s" : ""} found
            </span>
            <span>{result.queryTimeMs} ms</span>
          </div>

          {result.items.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No items found. Try a different description.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.items.map((item, idx) => {
                const matchPercent = (item.score / maxScore) * 100;
                const style = styleColors[item.style] || styleColors.Casual;
                const borderIntensity =
                  matchPercent > 80
                    ? "border-purple-400 dark:border-purple-500"
                    : matchPercent > 60
                      ? "border-purple-200 dark:border-purple-700"
                      : "border-gray-200 dark:border-gray-700";

                return (
                  <div
                    key={item.id || idx}
                    className={`border-2 ${borderIntensity} rounded-lg p-4 bg-white dark:bg-gray-900 transition-colors`}
                  >
                    {/* Header: name + match bar */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* Color swatch */}
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
                          style={{
                            backgroundColor:
                              colorMap[item.color] || "#ccc",
                          }}
                          title={item.color}
                        />
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {/* Match percentage bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all"
                          style={{ width: `${matchPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 shrink-0">
                        {matchPercent.toFixed(0)}%
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Category with icon */}
                      <span className="flex items-center gap-1 text-gray-500">
                        <span>{categoryIcons[item.category] || "🏷️"}</span>
                        {item.category}
                      </span>

                      {/* Style badge with color */}
                      <span
                        className={`px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {item.style}
                      </span>

                      {/* Season */}
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {item.season.slice(0, 2).join(", ")}
                        {item.season.length > 2 && "..."}
                      </span>

                      {/* Price */}
                      <span className="text-gray-400">{item.priceRange}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
