import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { fromWebToken } from "@aws-sdk/credential-providers";
import { getVercelOidcToken } from "@vercel/oidc";

const VECTOR_ENDPOINT =
  process.env.VECTOR_OPENSEARCH_ENDPOINT ||
  "https://9i1yy3zrca5efg16vasa.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";

const credentialsProvider = fromWebToken({
  roleArn: process.env.AWS_ROLE_ARN!,
  webIdentityTokenSupplier: () => getVercelOidcToken(),
});

function createVectorClient(): Client {
  return new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials: () => credentialsProvider(),
    }),
    node: VECTOR_ENDPOINT,
  });
}

export const vectorClient = createVectorClient();
