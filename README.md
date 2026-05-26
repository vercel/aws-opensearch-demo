# Amazon OpenSearch Serverless Demo

This demo uses Amazon OpenSearch Serverless with Next.js to showcase all three collection types: **Search**, **Vector**, and **Time Series**. It connects securely using AWS SigV4 authentication.

[![Banner](/public/banner.png)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKishoreKicha14%2Faws-opensearch-demo&env=OPENSEARCH_ENDPOINT,VECTOR_OPENSEARCH_ENDPOINT,TIMESERIES_OPENSEARCH_ENDPOINT,AWS_REGION,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY&envDescription=Amazon%20OpenSearch%20Serverless%20credentials)

**Demo Tabs:**

| Tab | Collection Type | Use Case |
|-----|----------------|----------|
| 🔍 Search | Search | Recipe search with facets, highlighting, and autocomplete |
| 🧠 Vector | Vector | Travel destination finder with semantic k-NN search |
| 📊 Time Series | Time Series | Weather station network with time-based aggregations |

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKishoreKicha14%2Faws-opensearch-demo&env=OPENSEARCH_ENDPOINT,VECTOR_OPENSEARCH_ENDPOINT,TIMESERIES_OPENSEARCH_ENDPOINT,AWS_REGION,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY&envDescription=Amazon%20OpenSearch%20Serverless%20credentials)

## Requirements

- Three Amazon OpenSearch Serverless collections (Search, Vector, Time Series)
- AWS credentials with data access policies configured
- Node.js 18+

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your collection endpoints and AWS credentials
```

3. Seed all three indexes:

```bash
npm run seed            # Recipe search index (107 recipes)
npm run seed:vector     # Travel destinations with embeddings (40 destinations)
npm run seed:timeseries # Weather station data (1344 hourly readings)
```

4. Start the development server:

```bash
npm run dev
```

5. View local development: http://localhost:3000

## Learn More

- [Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html)
- [OpenSearch Query DSL](https://opensearch.org/docs/latest/query-dsl/)
- [OpenSearch k-NN Plugin](https://opensearch.org/docs/latest/search-plugins/knn/)
- [Next.js Documentation](https://nextjs.org/docs)
