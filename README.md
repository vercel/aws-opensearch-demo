# Next.js + Amazon OpenSearch Demo

A [Next.js](https://nextjs.org/) application demonstrating full-text search powered by [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/).

## Overview

This template shows how to connect a Next.js app deployed on Vercel to an Amazon OpenSearch Service domain. It provides a simple movie search interface that uses OpenSearch's multi-match query with fuzzy matching and field boosting.

## Features

- Full-text search with relevance ranking
- Fuzzy matching for typo tolerance
- Field boosting (title > director > genre/plot)
- Server-side search via Next.js Server Actions
- Tailwind CSS styling

## Architecture

```
┌─────────────┐       ┌──────────────────────┐
│   Vercel    │──────▶│  Amazon OpenSearch    │
│  (Next.js)  │◀──────│  Service             │
└─────────────┘       └──────────────────────┘
```

## Getting Started

### Prerequisites

- An [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) domain
- Node.js 18+

### 1. Clone and install

```bash
git clone https://github.com/your-org/aws-opensearch-demo.git
cd aws-opensearch-demo
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your OpenSearch credentials:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `OPENSEARCH_ENDPOINT` | Your OpenSearch domain endpoint (e.g. `https://my-domain.us-east-1.es.amazonaws.com`) |
| `OPENSEARCH_USERNAME` | Master user name (if using fine-grained access control) |
| `OPENSEARCH_PASSWORD` | Master user password |

### 3. Seed the database

Populate the OpenSearch index with sample movie data:

```bash
npm run seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search for movies.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/aws-opensearch-demo&env=OPENSEARCH_ENDPOINT,OPENSEARCH_USERNAME,OPENSEARCH_PASSWORD&envDescription=Amazon%20OpenSearch%20Service%20credentials&envLink=https://docs.aws.amazon.com/opensearch-service/latest/developerguide/)

### Required Environment Variables

Set these in your Vercel project settings:

- `OPENSEARCH_ENDPOINT`
- `OPENSEARCH_USERNAME`
- `OPENSEARCH_PASSWORD`

### Network Access

Your OpenSearch domain must be accessible from Vercel's edge network. Options:

1. **Public access** with fine-grained access control (simplest for demos)
2. **VPC + Vercel Secure Compute** for production workloads
3. **IAM auth with OIDC federation** (most secure, no stored credentials)

## Learn More

- [Amazon OpenSearch Service Documentation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/)
- [OpenSearch JavaScript Client](https://opensearch.org/docs/latest/clients/javascript/index/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
