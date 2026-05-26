"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Brain, MapPin, Calendar, Compass, Thermometer } from "lucide-react";
import type { VectorSearchResult } from "@/lib/vector/queries";

interface Props {
  initialQuery: string;
  result: VectorSearchResult | null;
}

// Type → color mapping for badges
const typeColors: Record<string, { bg: string; text: string }> = {
  "Beach & Culture": { bg: "bg-cyan-50 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300" },
  "Luxury Beach": { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  "Romantic Island": { bg: "bg-pink-50 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300" },
  "Beach & Nightlife": { bg: "bg-violet-50 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300" },
  "Coastal Scenic": { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  "Adventure & Hiking": { bg: "bg-green-50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  "Nature & Adventure": { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
  "Adventure & Scenic": { bg: "bg-teal-50 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-300" },
  "Mountain & Skiing": { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
  "Eco-Adventure": { bg: "bg-lime-50 dark:bg-lime-900/30", text: "text-lime-700 dark:text-lime-300" },
  "Culture & History": { bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  "Culture & Markets": { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
  "History & Food": { bg: "bg-yellow-50 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300" },
  "City & Food": { bg: "bg-rose-50 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-300" },
  "City & Entertainment": { bg: "bg-indigo-50 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300" },
  "Wellness & Spiritual": { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  "Safari & Wildlife": { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  "Winter Wonderland": { bg: "bg-sky-50 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-300" },
  "Food & Wine": { bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30", text: "text-fuchsia-700 dark:text-fuchsia-300" },
};

const exampleQueries = [
  "a quiet beach getaway with great food",
  "adventure trip with hiking and stunning views",
  "romantic destination for a honeymoon",
  "cultural city break with amazing history",
  "winter wonderland with snow activities",
  "wildlife safari in Africa",
  "relaxing wellness retreat to recharge",
  "off the beaten path somewhere unique",
  "foodie destination with local cuisine",
  "tropical island on a budget",
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
            placeholder="Where do you want to go? Describe your dream trip..."
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
            Describe your ideal trip in natural language:
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
              {result.total} destination{result.total !== 1 ? "s" : ""} found
            </span>
            <span>{result.queryTimeMs} ms</span>
          </div>

          {result.items.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No destinations found. Try a different description.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.items.map((item, idx) => {
                const matchPercent = (item.score / maxScore) * 100;
                const typeStyle = typeColors[item.type] || {
                  bg: "bg-gray-50 dark:bg-gray-800",
                  text: "text-gray-700 dark:text-gray-300",
                };
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
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {item.name}
                      </h3>
                    </div>

                    {/* Match bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full"
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

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {item.region}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Thermometer className="w-3 h-3" />
                        {item.climate}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {item.bestSeason[0]}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded ${typeStyle.bg} ${typeStyle.text}`}>
                        {item.type}
                      </span>
                      <span className="text-gray-400">{item.budget}</span>
                    </div>

                    {/* Activities */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.activities.map((a) => (
                        <span
                          key={a}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500"
                        >
                          {a}
                        </span>
                      ))}
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
