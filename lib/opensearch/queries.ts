import { client } from "./client";
import { performance } from "perf_hooks";

const INDEX_NAME = "recipes";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  diet: string[];
  cookTimeMinutes: number;
  ingredients: string[];
  highlight?: {
    title?: string[];
    description?: string[];
    ingredients?: string[];
  };
  score?: number;
}

export interface Facets {
  cuisines: { key: string; count: number }[];
  diets: { key: string; count: number }[];
  cookTime: { key: string; from?: number; to?: number; count: number }[];
}

export interface SearchResult {
  recipes: Recipe[];
  facets: Facets;
  total: number;
  queryTimeMs: string;
}

export interface SearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  maxCookTime?: number;
}

export async function searchRecipes(params: SearchParams): Promise<SearchResult> {
  const startTime = performance.now();

  const must: any[] = [];
  const filter: any[] = [];

  // Full-text search with boosting
  if (params.query) {
    must.push({
      multi_match: {
        query: params.query,
        fields: ["title^3", "description^2", "ingredients", "cuisine"],
        fuzziness: "AUTO",
        type: "best_fields",
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  // Filters
  if (params.cuisine) {
    filter.push({ term: { "cuisine.keyword": params.cuisine } });
  }
  if (params.diet) {
    filter.push({ term: { "diet.keyword": params.diet } });
  }
  if (params.maxCookTime) {
    filter.push({ range: { cookTimeMinutes: { lte: params.maxCookTime } } });
  }

  const response = await client.search({
    index: INDEX_NAME,
    body: {
      query: {
        bool: { must, filter },
      },
      highlight: {
        fields: {
          title: { number_of_fragments: 0 },
          description: { number_of_fragments: 1, fragment_size: 150 },
          ingredients: { number_of_fragments: 3 },
        },
        pre_tags: ["<mark>"],
        post_tags: ["</mark>"],
      },
      aggs: {
        cuisines: {
          terms: { field: "cuisine.keyword", size: 15 },
        },
        diets: {
          terms: { field: "diet.keyword", size: 10 },
        },
        cook_time: {
          range: {
            field: "cookTimeMinutes",
            ranges: [
              { key: "Under 15 min", to: 15 },
              { key: "15–30 min", from: 15, to: 30 },
              { key: "30–60 min", from: 30, to: 60 },
              { key: "Over 60 min", from: 60 },
            ],
          },
        },
      },
      size: 12,
    },
  });

  const hits = response.body.hits;
  const aggs = response.body.aggregations;

  const recipes: Recipe[] = hits.hits.map((hit: any) => ({
    id: hit._id,
    ...hit._source,
    highlight: hit.highlight || undefined,
    score: hit._score,
  }));

  const total =
    typeof hits.total === "number" ? hits.total : hits.total.value;

  const facets: Facets = {
    cuisines: aggs.cuisines.buckets.map((b: any) => ({
      key: b.key,
      count: b.doc_count,
    })),
    diets: aggs.diets.buckets.map((b: any) => ({
      key: b.key,
      count: b.doc_count,
    })),
    cookTime: aggs.cook_time.buckets.map((b: any) => ({
      key: b.key,
      from: b.from,
      to: b.to,
      count: b.doc_count,
    })),
  };

  const endTime = performance.now();
  const queryTimeMs = (endTime - startTime).toFixed(2);

  return { recipes, facets, total, queryTimeMs };
}

export async function getSuggestions(prefix: string): Promise<string[]> {
  if (!prefix || prefix.length < 2) return [];

  const response = await client.search({
    index: INDEX_NAME,
    body: {
      suggest: {
        recipe_suggest: {
          prefix,
          completion: {
            field: "title_suggest",
            size: 5,
            fuzzy: { fuzziness: "AUTO" },
          },
        },
      },
      size: 0,
    },
  });

  const suggestions = response.body.suggest?.recipe_suggest?.[0]?.options || [];
  return suggestions.map((s: any) => s.text);
}
