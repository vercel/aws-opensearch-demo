"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Brain, Sparkles, Tag, Palette, Calendar } from "lucide-react";
import type { VectorSearchResult } from "@/lib/vector/queries";

interface Props {
  initialQuery: string;
  result: VectorSearchResult | null;
}

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

      {/* Example queries */}
      {!result && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Try these natural language queries:</p>
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
      )}

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
              {result.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {(item.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {item.color}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.season.join(", ")}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                      {item.style}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                      {item.priceRange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
