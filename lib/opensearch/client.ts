import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { fromWebToken } from "@aws-sdk/credential-providers";
import { getVercelOidcToken } from "@vercel/oidc";
import { requireEnv } from "@/lib/utils";

const OPENSEARCH_ENDPOINT = requireEnv("OPENSEARCH_ENDPOINT");
const AWS_REGION = requireEnv("AWS_REGION");
const AWS_ROLE_ARN = requireEnv("AWS_ROLE_ARN");

async function getCredentials() {
  const webIdentityToken = await getVercelOidcToken();
  return fromWebToken({
    roleArn: AWS_ROLE_ARN,
    webIdentityToken,
  })();
}

function createClient(): Client {
  return new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials,
    }),
    node: OPENSEARCH_ENDPOINT,
  });
}

export const client = createClient();
