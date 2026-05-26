"use server";

import { opensearchClient } from "@/lib/opensearch";
import type { Movie, SearchResult } from "@/lib/types";

const INDEX_NAME = "movies";

export async function searchMovies(query: string): Promise<SearchResult> {
  const response = await opensearchClient.search({
    index: INDEX_NAME,
    body: {
      query: {
        multi_match: {
          query,
          fields: ["title^3", "director^2", "genre", "plot"],
          fuzziness: "AUTO",
        },
      },
      size: 20,
    },
  });

  const hits = response.body.hits;

  const movies: Movie[] = hits.hits.map((hit: any) => ({
    id: hit._id,
    ...hit._source,
  }));

  return {
    movies,
    total: typeof hits.total === "number" ? hits.total : hits.total.value,
    took: response.body.took,
  };
}
