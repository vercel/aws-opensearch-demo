import { vectorClient } from "./client";
import { generateEmbedding } from "./embeddings";
import { performance } from "perf_hooks";

const INDEX_NAME = "fashion";

export interface FashionResult {
  id: string;
  name: string;
  description: string;
  category: string;
  style: string;
  season: string[];
  occasion: string[];
  color: string;
  priceRange: string;
  score: number;
}

export interface VectorSearchResult {
  items: FashionResult[];
  queryTimeMs: string;
  total: number;
}

export async function semanticSearch(
  query: string,
): Promise<VectorSearchResult> {
  try {
    const startTime = performance.now();

    // Generate embedding for the user's query
    const queryVector = await generateEmbedding(query);

    // k-NN search in OpenSearch Serverless
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
    const items: FashionResult[] = hits.hits.map((hit: any) => ({
      id: hit._id,
      name: hit._source.name,
      description: hit._source.description,
      category: hit._source.category,
      style: hit._source.style,
      season: hit._source.season,
      occasion: hit._source.occasion,
      color: hit._source.color,
      priceRange: hit._source.priceRange,
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
