"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/opensearch/queries";
import { Clock, Utensils, ChevronDown, ChevronUp, Users } from "lucide-react";

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  const [expanded, setExpanded] = useState(false);

  const titleHtml = recipe.highlight?.title?.[0] || recipe.title;
  const descriptionHtml =
    recipe.highlight?.description?.[0] || recipe.description;

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Summary */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow min-w-0">
            <h3
              className="font-semibold text-gray-900 dark:text-gray-100 [&_mark]:bg-yellow-300 [&_mark]:dark:bg-yellow-700 [&_mark]:px-0.5 [&_mark]:rounded"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
            <p
              className="text-sm text-gray-600 dark:text-gray-400 mt-1 [&_mark]:bg-yellow-300 [&_mark]:dark:bg-yellow-700 [&_mark]:px-0.5 [&_mark]:rounded"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {recipe.score != null && recipe.score > 0 && (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded font-mono">
                {recipe.score.toFixed(2)}
              </span>
            )}
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            {recipe.cuisine}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.cookTimeMinutes} min
          </span>
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {recipe.servings} servings
            </span>
          )}
          {recipe.diet.length > 0 && (
            <span className="flex items-center gap-1">
              {recipe.diet.map((d) => (
                <span
                  key={d}
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded"
                >
                  {d}
                </span>
              ))}
            </span>
          )}
        </div>

        {/* Highlighted ingredients (when not expanded) */}
        {!expanded && recipe.highlight?.ingredients && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Matched ingredients: </span>
            <span
              className="[&_mark]:bg-yellow-300 [&_mark]:dark:bg-yellow-700 [&_mark]:px-0.5 [&_mark]:rounded"
              dangerouslySetInnerHTML={{
                __html: recipe.highlight.ingredients.join(", "),
              }}
            />
          </div>
        )}
      </div>

      {/* Expanded detail view */}
      {expanded && (
        <div
          className="border-t border-gray-100 dark:border-gray-800 px-4 pb-4 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ingredients */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Ingredients
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                >
                  <span className="text-gray-400 mt-0.5">•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Instructions
              </h4>
              <ol className="space-y-2">
                {recipe.instructions.map((step, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 dark:text-gray-300 flex gap-3"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* If no instructions, show a note */}
          {(!recipe.instructions || recipe.instructions.length === 0) && (
            <p className="text-xs text-gray-400 italic">
              Full cooking instructions coming soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
