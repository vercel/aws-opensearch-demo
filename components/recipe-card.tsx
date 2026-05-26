import type { Recipe } from "@/lib/opensearch/queries";
import { Clock, Utensils } from "lucide-react";

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  const titleHtml =
    recipe.highlight?.title?.[0] || recipe.title;
  const descriptionHtml =
    recipe.highlight?.description?.[0] || recipe.description;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
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
        {recipe.score != null && recipe.score > 0 && (
          <span className="shrink-0 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded font-mono">
            {recipe.score.toFixed(2)}
          </span>
        )}
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

      {/* Highlighted ingredients */}
      {recipe.highlight?.ingredients && (
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
  );
}
