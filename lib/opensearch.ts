import { Client } from "@opensearch-project/opensearch";

function getClient(): Client {
  const endpoint = process.env.OPENSEARCH_ENDPOINT;
  if (!endpoint) {
    throw new Error("OPENSEARCH_ENDPOINT environment variable is not set");
  }

  const username = process.env.OPENSEARCH_USERNAME;
  const password = process.env.OPENSEARCH_PASSWORD;

  if (username && password) {
    // Basic auth (fine-grained access control)
    return new Client({
      node: endpoint,
      auth: { username, password },
      ssl: { rejectUnauthorized: true },
    });
  }

  // Fallback: unsigned requests (use with IAM auth via a proxy or
  // when running on infrastructure with an attached IAM role and
  // OpenSearch configured to allow unsigned requests from the VPC)
  return new Client({
    node: endpoint,
    ssl: { rejectUnauthorized: true },
  });
}

export const opensearchClient = getClient();
