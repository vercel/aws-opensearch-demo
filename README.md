# OpenSearch Recipe Search Demo

A full-text **recipe search engine** powered by [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) and [Next.js](https://nextjs.org/), deployed on Vercel.

## Features

- **Full-text search** with relevance scoring and fuzzy matching
- **Faceted filtering** — filter by cuisine, dietary tags, and cook time
- **Real-time aggregations** — filter counts update dynamically
- **Search highlighting** — matched terms are visually highlighted in results
- **Autocomplete** — completion suggestions as you type
- **Custom analyzers** — synonym support (e.g. "bbq" matches "barbecue")
- **Relevance scores** — visible per-result to show ranking quality

## OpenSearch Features Demonstrated

| Feature | How it's used |
|---------|---------------|
| `multi_match` | Search across title, description, ingredients with field boosting |
| `fuzziness: AUTO` | Typo tolerance (e.g. "chiken" → "chicken") |
| `highlight` | `<mark>` tags around matched terms in results |
| `aggregations` | Faceted counts for cuisine, diet, cook time ranges |
| `completion` suggester | Autocomplete dropdown as you type |
| Custom `analyzer` | Synonym filter (bbq/barbecue, veggie/vegetable) |
| `range` aggregation | Cook time bucketed into human-friendly ranges |

## Getting Started

### Prerequisites

- An [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) domain
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

This creates a `recipes` index with 30 recipes, custom analyzers, and completion suggestions.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KishoreKicha14/aws-opensearch-demo&env=OPENSEARCH_ENDPOINT,OPENSEARCH_USERNAME,OPENSEARCH_PASSWORD&envDescription=Amazon%20OpenSearch%20Service%20credentials&envLink=https://docs.aws.amazon.com/opensearch-service/latest/developerguide/)

### Required Environment Variables

- `OPENSEARCH_ENDPOINT` — Your OpenSearch domain endpoint
- `OPENSEARCH_USERNAME` — Master user name (fine-grained access control)
- `OPENSEARCH_PASSWORD` — Master user password

## Architecture

```
┌─────────────────┐         ┌──────────────────────────┐
│   Vercel        │         │  Amazon OpenSearch        │
│   (Next.js)     │────────▶│  Service                 │
│                 │◀────────│                          │
│  • SSR search   │         │  • Inverted indices      │
│  • API routes   │         │  • Aggregations          │
│  • Autocomplete │         │  • Completion suggester  │
└─────────────────┘         └──────────────────────────┘
```

## Learn More

- [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/)
- [OpenSearch Query DSL](https://opensearch.org/docs/latest/query-dsl/)
- [OpenSearch Aggregations](https://opensearch.org/docs/latest/aggregations/)
- [Next.js Documentation](https://nextjs.org/docs)
