import { Suspense } from "react";
import { semanticSearch } from "@/lib/vector/queries";
import { VectorSearchInterface } from "@/components/vector-search";
import Loading from "@/components/loading";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function VectorPage({ searchParams }: Props) {
  return (
    <div>
      <div className="text-sm border border-dashed border-gray-300 dark:border-gray-600 p-4 mb-4 bg-white dark:bg-gray-900 rounded">
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          <b className="font-bold">AI Fashion Assistant</b> — powered by
          OpenSearch Serverless (Vector collection) with semantic embeddings.
        </p>
        <details className="group">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs">
            How does this work?
          </summary>
          <p className="p-3 mt-2 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
            Your query is converted into a 384-dimensional vector using the
            all-MiniLM-L6-v2 model. OpenSearch then performs a k-nearest
            neighbors (k-NN) search to find fashion items whose embeddings are
            closest in vector space — matching by meaning, not keywords.
          </p>
        </details>
      </div>

      <Suspense fallback={<Loading />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || "";
  const result = query ? await semanticSearch(query) : null;

  return <VectorSearchInterface initialQuery={query} result={result} />;
}
