import { config } from "dotenv";
import path from "path";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { fashionItems } from "./fashion-items";
import { generateEmbedding, EMBEDDING_DIM } from "./embeddings";

config({ path: path.resolve(process.cwd(), ".env.local") });

const VECTOR_ENDPOINT =
  process.env.VECTOR_OPENSEARCH_ENDPOINT ||
  "https://9i1yy3zrca5efg16vasa.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const INDEX_NAME = "fashion";

async function main() {
  const client = new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: VECTOR_ENDPOINT,
  });

  // Delete index if exists
  try {
    await client.indices.delete({ index: INDEX_NAME });
    console.log(`Deleted existing index "${INDEX_NAME}".`);
  } catch (e: any) {
    console.log("Index does not exist yet, creating fresh.");
  }

  // Create index with k-NN mapping
  console.log(`Creating index "${INDEX_NAME}" with k-NN mapping...`);
  await client.indices.create({
    index: INDEX_NAME,
    body: {
      settings: {
        "index.knn": true,
      },
      mappings: {
        properties: {
          name: { type: "text" },
          description: { type: "text" },
          category: { type: "keyword" },
          style: { type: "keyword" },
          season: { type: "keyword" },
          occasion: { type: "keyword" },
          color: { type: "keyword" },
          priceRange: { type: "keyword" },
          embedding: {
            type: "knn_vector",
            dimension: EMBEDDING_DIM,
            method: {
              name: "hnsw",
              space_type: "cosinesimil",
              engine: "nmslib",
            },
          },
        },
      },
    },
  });
  console.log("Index created.");

  // Generate embeddings and index items
  console.log(`Generating embeddings for ${fashionItems.length} items...`);

  for (let i = 0; i < fashionItems.length; i++) {
    const item = fashionItems[i];
    const text = `${item.name}. ${item.description}. Style: ${item.style}. Category: ${item.category}. Season: ${item.season.join(", ")}. Occasion: ${item.occasion.join(", ")}. Color: ${item.color}.`;

    const embedding = await generateEmbedding(text);

    await client.index({
      index: INDEX_NAME,
      id: item.id,
      body: {
        ...item,
        embedding,
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`  Indexed ${i + 1} / ${fashionItems.length}`);
    }
  }

  console.log(`\nSuccessfully indexed ${fashionItems.length} fashion items.`);

  // Wait for indexing
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const count = await client.count({ index: INDEX_NAME });
  console.log(`Total documents in index: ${count.body.count}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
