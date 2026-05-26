import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { config } from "dotenv";
import { Client } from "@opensearch-project/opensearch";

config({ path: path.resolve(process.cwd(), ".env.local") });

const INDEX_NAME = "movies";

async function readMovieTitlesFromCSV(): Promise<string[]> {
  const movieTitles = new Set<string>();
  const csvFilePath = path.resolve(__dirname, "movies.csv");

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        const title = row.title?.trim();
        if (title) {
          movieTitles.add(title);
        }
      })
      .on("end", () => {
        const uniqueMovieTitles = Array.from(movieTitles);
        console.log(
          `Parsed ${uniqueMovieTitles.length} unique movies from CSV.`,
        );
        resolve(uniqueMovieTitles);
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
}

async function main() {
  const endpoint = process.env.OPENSEARCH_ENDPOINT;
  if (!endpoint) {
    console.error("Error: OPENSEARCH_ENDPOINT is not set");
    process.exit(1);
  }

  const username = process.env.OPENSEARCH_USERNAME;
  const password = process.env.OPENSEARCH_PASSWORD;

  const client = new Client({
    node: endpoint,
    ...(username && password ? { auth: { username, password } } : {}),
    ssl: { rejectUnauthorized: false },
  });

  // Delete index if it exists
  const exists = await client.indices.exists({ index: INDEX_NAME });
  if (exists.body) {
    console.log(`Deleting existing index "${INDEX_NAME}"...`);
    await client.indices.delete({ index: INDEX_NAME });
  }

  // Create index with mappings
  console.log(`Creating index "${INDEX_NAME}"...`);
  await client.indices.create({
    index: INDEX_NAME,
    body: {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
      },
      mappings: {
        properties: {
          id: { type: "integer" },
          title: {
            type: "text",
            analyzer: "standard",
            fields: { keyword: { type: "keyword" } },
          },
          score: { type: "integer" },
          last_vote_time: { type: "date" },
          voters: { type: "keyword" },
        },
      },
    },
  });

  const movieTitles = await readMovieTitlesFromCSV();
  const defaultDate = new Date("2024-12-07").toISOString();

  console.log(`Indexing ${movieTitles.length} movies...`);

  const batchSize = 500;
  for (let i = 0; i < movieTitles.length; i += batchSize) {
    const batch = movieTitles.slice(i, i + batchSize);
    const body = batch.flatMap((title, idx) => [
      { index: { _index: INDEX_NAME, _id: String(i + idx + 1) } },
      {
        id: i + idx + 1,
        title,
        score: 0,
        last_vote_time: defaultDate,
        voters: [],
      },
    ]);

    const bulkResponse = await client.bulk({ body, refresh: false });

    if (bulkResponse.body.errors) {
      const errors = bulkResponse.body.items.filter(
        (item: any) => item.index?.error,
      );
      console.error(`Batch errors: ${errors.length}`);
    }

    console.log(
      `Indexed ${Math.min(i + batchSize, movieTitles.length)} movies...`,
    );
  }

  // Final refresh
  await client.indices.refresh({ index: INDEX_NAME });

  const count = await client.count({ index: INDEX_NAME });
  console.log(`Successfully seeded ${count.body.count} movies`);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
