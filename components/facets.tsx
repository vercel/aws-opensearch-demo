"use client";

import { cn } from "@/lib/utils";
import type { Facets as FacetsType } from "@/lib/opensearch/queries";

interface Props {
  facets: FacetsType;
  activeCuisine: string;
  activeDiet: string;
  activeTime: string;
  onFilterChange: (key: string, value: string) => void;
}

export function Facets({
  facets,
  activeCuisine,
  activeDiet,
  activeTime,
  onFilterChange,
}: Props) {
  return (
    <div className="space-y-5 text-sm">
      {/* Cuisine facet */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Cuisine
        </h3>
        <ul className="space-y-1">
          {facets.cuisines.map((c) => (
            <li key={c.key}>
              <button
                onClick={() => onFilterChange("cuisine", c.key)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  activeCuisine === c.key &&
                    "bg-gray-200 dark:bg-gray-700 font-medium",
                )}
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {c.key}
                </span>
                <span className="text-gray-400 text-xs">{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Diet facet */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Dietary
        </h3>
        <ul className="space-y-1">
          {facets.diets.map((d) => (
            <li key={d.key}>
              <button
                onClick={() => onFilterChange("diet", d.key)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  activeDiet === d.key &&
                    "bg-gray-200 dark:bg-gray-700 font-medium",
                )}
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {d.key}
                </span>
                <span className="text-gray-400 text-xs">{d.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Cook time facet */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Cook Time
        </h3>
        <ul className="space-y-1">
          {facets.cookTime
            .filter((t) => t.count > 0)
            .map((t) => {
              const timeValue = t.to ? String(t.to) : "999";
              const isActive = activeTime === timeValue;
              return (
                <li key={t.key}>
                  <button
                    onClick={() => onFilterChange("time", timeValue)}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                      isActive && "bg-gray-200 dark:bg-gray-700 font-medium",
                    )}
                  >
                    <span className="text-gray-800 dark:text-gray-200">
                      {t.key}
                    </span>
                    <span className="text-gray-400 text-xs">{t.count}</span>
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
