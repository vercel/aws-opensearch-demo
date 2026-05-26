import { config } from "dotenv";
import path from "path";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { recipes } from "./recipes";

config({ path: path.resolve(process.cwd(), ".env.local") });

const OPENSEARCH_ENDPOINT =
  process.env.OPENSEARCH_ENDPOINT ||
  "https://3ktzid9y809gx6psrzlg.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const INDEX_NAME = "recipes";

async function main() {
  const opensearch = new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: OPENSEARCH_ENDPOINT,
  });

  // Delete index if it exists
  try {
    await opensearch.indices.delete({ index: INDEX_NAME });
    console.log(`Deleted existing index "${INDEX_NAME}".`);
  } catch (e: any) {
    if (e.statusCode !== 404) {
      console.log("Index does not exist yet, creating fresh.");
    }
  }

  // Create index with mappings
  console.log(`Creating index "${INDEX_NAME}"...`);
  await opensearch.indices.create({
    index: INDEX_NAME,
    body: {
      mappings: {
        properties: {
          title: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          description: { type: "text" },
          cuisine: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          diet: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          cookTimeMinutes: { type: "integer" },
          ingredients: { type: "text" },
        },
      },
    },
  });
  console.log("Index created.");

  // Bulk index in batches
  console.log(`Indexing ${recipes.length} recipes...`);
  const batchSize = 50;

  for (let i = 0; i < recipes.length; i += batchSize) {
    const batch = recipes.slice(i, i + batchSize);
    const body = batch.flatMap((recipe, idx) => [
      { index: { _index: INDEX_NAME, _id: String(i + idx + 1) } },
      recipe,
    ]);

    const bulkResponse = await opensearch.bulk({ body });

    if (bulkResponse.body.errors) {
      const errors = bulkResponse.body.items.filter(
        (item: any) => item.index?.error,
      );
      console.error(`Batch ${i / batchSize + 1} had ${errors.length} errors`);
    } else {
      console.log(
        `Batch ${i / batchSize + 1}: indexed ${Math.min(i + batchSize, recipes.length)} / ${recipes.length}`,
      );
    }
  }

  // Wait for indexing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Verify
  const count = await opensearch.count({ index: INDEX_NAME });
  console.log(`\nTotal documents in index: ${count.body.count}`);
  console.log("Done!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
