# Amazon OpenSearch Movies Demo

This demo uses **Amazon OpenSearch Service** with Next.js to search and vote on movies. It connects to OpenSearch using basic authentication (fine-grained access control).

## How it works

- Movies are indexed in an OpenSearch domain with full-text search capabilities
- The app uses OpenSearch's `multi_match` query with fuzzy matching for typo-tolerant search
- Users can upvote/downvote movies with optimistic UI updates via `useOptimistic`
- Query performance is displayed in real-time

## Getting Started

### Prerequisites

- An [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) domain with fine-grained access control enabled
- Node.js 18+

### Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your OpenSearch endpoint and credentials
```

### Seed the index

```bash
npm run seed
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KishoreKicha14/aws-opensearch-demo&env=OPENSEARCH_ENDPOINT,OPENSEARCH_USERNAME,OPENSEARCH_PASSWORD&envDescription=Amazon%20OpenSearch%20Service%20credentials&envLink=https://docs.aws.amazon.com/opensearch-service/latest/developerguide/)

### Required Environment Variables

- `OPENSEARCH_ENDPOINT` — Your OpenSearch domain endpoint
- `OPENSEARCH_USERNAME` — Master user name
- `OPENSEARCH_PASSWORD` — Master user password

## Learn More

- [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/)
- [OpenSearch JavaScript Client](https://opensearch.org/docs/latest/clients/javascript/index/)
- [Next.js Documentation](https://nextjs.org/docs)
