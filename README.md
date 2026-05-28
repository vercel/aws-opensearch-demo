# Amazon OpenSearch Serverless Demo

This demo uses Amazon OpenSearch Serverless with Next.js to showcase full-text recipe search with facets, highlighting, and autocomplete. It connects securely using AWS SigV4 authentication, with credentials obtained via **Vercel OIDC** — no static AWS keys required.

[![Banner](/public/banner.png)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-opensearch-demo&project-name=aws-opensearch-demo&repository-name=aws-opensearch-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22aws%22%2C%22productSlug%22%3A%22opensearch%22%2C%22protocol%22%3A%22other%22%7D%5D)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-opensearch-demo&project-name=aws-opensearch-demo&repository-name=aws-opensearch-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22aws%22%2C%22productSlug%22%3A%22opensearch%22%2C%22protocol%22%3A%22other%22%7D%5D)

## How auth works

The app uses [`@vercel/oidc`](https://www.npmjs.com/package/@vercel/oidc) to read Vercel's short-lived OIDC token and exchanges it for AWS credentials via STS `AssumeRoleWithWebIdentity` (`fromWebToken` in the AWS SDK). On Vercel, `VERCEL_OIDC_TOKEN` is injected automatically; locally, `vercel env pull` writes one valid for ~12 hours.

## Requirements

- An Amazon OpenSearch Serverless Search collection
- An IAM role whose trust policy allows Vercel's OIDC issuer (`https://oidc.vercel.com/<team-slug>`) and whose policy grants `aoss:APIAccessAll` on the collection. The Vercel AWS OpenSearch integration creates this role automatically and exposes it as the env vars below.
- Node.js 18+

### Environment variables

Provisioned automatically when you install the Vercel AWS OpenSearch integration. After `vercel env pull .env.local` you should see:

| Variable | Purpose |
|---|---|
| `OPENSEARCH_ENDPOINT` | Search collection endpoint |
| `AWS_REGION` | Region of the search collection |
| `AWS_ROLE_ARN` | IAM role with access to the search collection |
| `VERCEL_OIDC_TOKEN` | Short-lived Vercel OIDC token (auto-injected on Vercel; written locally by `vercel env pull`) |

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

3. Seed the recipe index:

```bash
npm run seed
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
- [Next.js Documentation](https://nextjs.org/docs)
