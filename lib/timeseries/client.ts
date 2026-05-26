import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const TIMESERIES_ENDPOINT =
  process.env.TIMESERIES_OPENSEARCH_ENDPOINT ||
  "https://vbo1rhe5zcrxqndiyafg.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";

function createTimeseriesClient(): Client {
  return new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: TIMESERIES_ENDPOINT,
  });
}

export const timeseriesClient = createTimeseriesClient();
