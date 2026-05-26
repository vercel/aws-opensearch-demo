"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "./recipe-card";
import { Facets } from "./facets";
import type { SearchResult } from "@/lib/opensearch/queries";
import { Search, X } from "lucide-react";

interface Props {
  initialQuery: string;
  initialCuisine: string;
  initialDiet: string;
  initialTime: string;
  result: SearchResult;
}

export function SearchInterface({
  initialQuery,
  initialCuisine,
  initialDiet,
  initialTime,
  result,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const buildUrl = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged = {
        q: query,
        cuisine: initialCuisine,
        diet: initialDiet,
        time: initialTime,
        ...overrides,
      };
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      return `/search?${params.toString()}`;
    },
    [query, initialCuisine, initialDiet, initialTime],
  );

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        e.target !== inputRef.current
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery ?? query;
    setShowSuggestions(false);
    router.push(buildUrl({ q }));
  };

  const handleFilterChange = (key: string, value: string) => {
    const current =
      key === "cuisine"
        ? initialCuisine
        : key === "diet"
          ? initialDiet
          : initialTime;
    // Toggle off if same value
    const newValue = current === value ? "" : value;
    router.push(buildUrl({ [key]: newValue }));
  };

  const clearAll = () => {
    setQuery("");
    router.push("/search");
  };

  const hasFilters = initialQuery || initialCuisine || initialDiet || initialTime;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder='Search recipes... (press "/" to focus)'
            className="pl-9 pr-8 text-base bg-white dark:bg-gray-950 text-black dark:text-white focus:border-black dark:border-gray-700 dark:focus:border-gray-200 w-full"
          />
          {hasFilters && (
            <button
              onClick={clearAll}
              className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
                onClick={() => {
                  setQuery(s);
                  handleSearch(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {result.total} recipe{result.total !== 1 ? "s" : ""} found
        </span>
        <span>{result.queryTimeMs} ms</span>
      </div>

      {/* Main content: facets + results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <Facets
            facets={result.facets}
            activeCuisine={initialCuisine}
            activeDiet={initialDiet}
            activeTime={initialTime}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className="md:col-span-3 space-y-3">
          {result.recipes.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No recipes found. Try a different search or clear filters.
            </p>
          ) : (
            result.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
