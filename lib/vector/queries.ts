import { vectorClient } from "./client";
import { generateEmbedding } from "./embeddings";
import { performance } from "perf_hooks";

const INDEX_NAME = "destinations";

export interface DestinationResult {
  id: string;
  name: string;
  description: string;
  country: string;
  region: string;
  type: string;
  bestSeason: string[];
  activities: string[];
  budget: string;
  climate: string;
  score: number;
}

export interface VectorSearchResult {
  items: DestinationResult[];
  queryTimeMs: string;
  total: number;
}

export async function semanticSearch(
  query: string,
): Promise<VectorSearchResult> {
  try {
    const startTime = performance.now();

    const queryVector = await generateEmbedding(query);

    const response = await vectorClient.search({
      index: INDEX_NAME,
      body: {
        size: 8,
        query: {
          knn: {
            embedding: {
              vector: queryVector,
              k: 8,
            },
          },
        },
        _source: { excludes: ["embedding"] },
      },
    });

    const hits = response.body.hits;
    const items: DestinationResult[] = hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
      score: hit._score,
    }));

    const total =
      typeof hits.total === "number" ? hits.total : hits.total.value;

    const endTime = performance.now();
    const queryTimeMs = (endTime - startTime).toFixed(2);

    return { items, queryTimeMs, total };
  } catch (error: any) {
    console.error("Vector search failed:", error.message);
    return { items: [], queryTimeMs: "0", total: 0 };
  }
}
