import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const OPENSEARCH_ENDPOINT =
  process.env.OPENSEARCH_ENDPOINT ||
  "https://3ktzid9y809gx6psrzlg.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";

function createClient(): Client {
  return new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss", // "aoss" for OpenSearch Serverless
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: OPENSEARCH_ENDPOINT,
  });
}

export const client = createClient();
