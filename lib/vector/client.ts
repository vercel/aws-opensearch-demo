import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { fromWebToken } from "@aws-sdk/credential-providers";
import { getVercelOidcToken } from "@vercel/oidc";
import { requireEnv } from "@/lib/utils";

const VECTOR_ENDPOINT = requireEnv("VECTOR_OPENSEARCH_ENDPOINT");
const AWS_REGION = requireEnv("VECTOR_AWS_REGION");
const VECTOR_AWS_ROLE_ARN = requireEnv("VECTOR_AWS_ROLE_ARN");

async function getCredentials() {
  const webIdentityToken = await getVercelOidcToken();
  return fromWebToken({
    roleArn: VECTOR_AWS_ROLE_ARN,
    webIdentityToken,
  })();
}

function createVectorClient(): Client {
  return new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials,
    }),
    node: VECTOR_ENDPOINT,
  });
}

export const vectorClient = createVectorClient();
