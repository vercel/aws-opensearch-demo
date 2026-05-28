import { config } from "dotenv";
import path from "path";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { fromWebToken } from "@aws-sdk/credential-providers";
import { getVercelOidcToken } from "@vercel/oidc";
import { destinations } from "./fashion-items";
import { generateEmbedding, EMBEDDING_DIM } from "./embeddings";

config({ path: path.resolve(process.cwd(), ".env.local") });

const VECTOR_ENDPOINT =
  process.env.VECTOR_OPENSEARCH_ENDPOINT ||
  "https://9i1yy3zrca5efg16vasa.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const INDEX_NAME = "destinations";

async function main() {
  const getCredentials = async () => {
    const webIdentityToken = await getVercelOidcToken();
    return fromWebToken({
      roleArn: process.env.AWS_ROLE_ARN!,
      webIdentityToken,
    })();
  };

  const client = new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials,
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

  // Create index with k-NN mapping (AOSS Vector compatible)
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
          country: { type: "keyword" },
          region: { type: "keyword" },
          type: { type: "keyword" },
          bestSeason: { type: "keyword" },
          activities: { type: "keyword" },
          budget: { type: "keyword" },
          climate: { type: "keyword" },
          embedding: {
            type: "knn_vector",
            dimension: EMBEDDING_DIM,
            method: {
              name: "hnsw",
              space_type: "l2",
              engine: "faiss",
            },
          },
        },
      },
    },
  });
  console.log("Index created. Waiting for it to become ready...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Generate embeddings and index
  console.log(`Generating embeddings for ${destinations.length} destinations...`);

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const text = `${dest.name}. ${dest.description}. Type: ${dest.type}. Region: ${dest.region}. Activities: ${dest.activities.join(", ")}. Climate: ${dest.climate}. Best season: ${dest.bestSeason.join(", ")}.`;

    const embedding = await generateEmbedding(text);

    await client.index({
      index: INDEX_NAME,
      body: {
        ...dest,
        embedding,
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`  Indexed ${i + 1} / ${destinations.length}`);
    }
  }

  console.log(`\nSuccessfully indexed ${destinations.length} destinations.`);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  const count = await client.count({ index: INDEX_NAME });
  console.log(`Total documents in index: ${count.body.count}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
