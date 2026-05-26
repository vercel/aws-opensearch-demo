import { Client } from "@opensearch-project/opensearch";

function createClient(): Client {
  const endpoint = process.env.OPENSEARCH_ENDPOINT;
  if (!endpoint) {
    throw new Error("OPENSEARCH_ENDPOINT environment variable is not set");
  }

  const username = process.env.OPENSEARCH_USERNAME;
  const password = process.env.OPENSEARCH_PASSWORD;

  if (username && password) {
    return new Client({
      node: endpoint,
      auth: { username, password },
      ssl: { rejectUnauthorized: false },
    });
  }

  return new Client({
    node: endpoint,
    ssl: { rejectUnauthorized: false },
  });
}

export const client = createClient();
