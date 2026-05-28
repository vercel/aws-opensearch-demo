import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { fromWebToken } from "@aws-sdk/credential-providers";
import { getVercelOidcToken } from "@vercel/oidc";

const OPENSEARCH_ENDPOINT =
  process.env.OPENSEARCH_ENDPOINT ||
  "https://3ktzid9y809gx6psrzlg.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";

async function getCredentials() {
  const webIdentityToken = await getVercelOidcToken();
  return fromWebToken({
    roleArn: process.env.AWS_ROLE_ARN!,
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
