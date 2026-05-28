# Amazon OpenSearch Serverless Demo

This demo uses Amazon OpenSearch Serverless with Next.js to showcase two collection types: **Search** and **Vector**. It connects securely using AWS SigV4 authentication, with credentials obtained via **Vercel OIDC** — no static AWS keys required.

[![Banner](/public/banner.png)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-opensearch-demo&project-name=aws-opensearch-demo&repository-name=aws-opensearch-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22aws%22%2C%22productSlug%22%3A%22opensearch%22%2C%22protocol%22%3A%22storage%22%7D%5D)

**Demo Tabs:**

| Tab | Collection Type | Use Case |
|-----|----------------|----------|
| 🔍 Search | Search | Recipe search with facets, highlighting, and autocomplete |
| 🧠 Vector | Vector | Travel destination finder with semantic k-NN search |

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-opensearch-demo&project-name=aws-opensearch-demo&repository-name=aws-opensearch-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22aws%22%2C%22productSlug%22%3A%22opensearch%22%2C%22protocol%22%3A%22storage%22%7D%5D)

## How auth works

The app uses [`@vercel/oidc`](https://www.npmjs.com/package/@vercel/oidc) to read Vercel's short-lived OIDC token and exchanges it for AWS credentials via STS `AssumeRoleWithWebIdentity` (`fromWebToken` in the AWS SDK). On Vercel, `VERCEL_OIDC_TOKEN` is injected automatically; locally, `vercel env pull` writes one valid for ~12 hours.

## Requirements

- Two Amazon OpenSearch Serverless collections (Search, Vector) — each may live in a different AWS region
- One IAM role per collection, where each role's trust policy allows Vercel's OIDC issuer (`https://oidc.vercel.com/<team-slug>`) and its policy grants `aoss:APIAccessAll` on that collection. The Vercel AWS OpenSearch integration creates these per-collection roles automatically and exposes them as the env vars below.
- Node.js 18+

### Environment variables

Provisioned automatically when you install the Vercel AWS OpenSearch integration once per collection. After `vercel env pull .env.local` you should see:

| Variable | Purpose |
|---|---|
| `OPENSEARCH_ENDPOINT` | Search collection endpoint |
| `AWS_REGION` | Region of the search collection |
| `AWS_ROLE_ARN` | IAM role with access to the search collection |
| `VECTOR_OPENSEARCH_ENDPOINT` | Vector collection endpoint |
| `VECTOR_AWS_REGION` | Region of the vector collection (may differ from `AWS_REGION`) |
| `VECTOR_AWS_ROLE_ARN` | IAM role with access to the vector collection |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key, used to generate query embeddings for the vector page (`openai/text-embedding-3-small`). Create one at https://vercel.com/[team]/~/ai-gateway/api-keys |
| `VERCEL_OIDC_TOKEN` | Short-lived Vercel OIDC token (auto-injected on Vercel; written locally by `vercel env pull`) |

> The integration creates a **separate IAM role per collection**, each scoped to that one collection's ARN. The search and vector clients therefore use different role ARNs and regions — don't try to share one role across both.

### Configure the IAM role trust policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::<account-id>:oidc-provider/oidc.vercel.com/<team-slug>" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.vercel.com/<team-slug>:aud": "https://vercel.com/<team-slug>"
        }
      }
    }
  ]
}
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Link the project and pull env vars (this provisions `VERCEL_OIDC_TOKEN`):

```bash
vercel link
vercel env pull .env.local
```

3. Seed both indexes:

```bash
npm run seed         # Recipe search index (107 recipes)
npm run seed:vector  # Travel destinations with embeddings (40 destinations)
```

4. Start the development server:

```bash
npm run dev
```

5. View local development: http://localhost:3000

> The local OIDC token expires after ~12 hours. If you see AWS auth errors mid-session, re-run `vercel env pull .env.local --yes`.

## Learn More

- [Vercel OIDC Federation](https://vercel.com/docs/oidc)
- [`@vercel/oidc` on npm](https://www.npmjs.com/package/@vercel/oidc)
- [Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html)
- [OpenSearch Query DSL](https://opensearch.org/docs/latest/query-dsl/)
- [OpenSearch k-NN Plugin](https://opensearch.org/docs/latest/search-plugins/knn/)
- [Next.js Documentation](https://nextjs.org/docs)
