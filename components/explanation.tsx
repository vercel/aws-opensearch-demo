import Link from "next/link";
import Image from "next/image";

export default function Explanation() {
  return (
    <div className="text-gray-800 dark:text-gray-200 text-sm border border-dashed border-gray-300 dark:border-gray-600 p-4 mb-4 font-mono bg-white dark:bg-gray-900">
      <div className="mb-4">
        <Image
          src="/banner.png"
          alt="Vercel AWS OpenSearch Serverless integration"
          width={600}
          height={315}
          className="w-full h-auto rounded"
          loading="eager"
        />
      </div>
      <p className="mb-2">
        This app uses <b className="font-bold">Amazon OpenSearch Serverless</b>{" "}
        with Next.js and Vercel (
        <Link
          href="https://github.com/vercel/aws-opensearch-demo"
          target="_blank"
          rel="noreferrer"
          className="text-gray-900 dark:text-white border-b border-gray-900 dark:border-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          view source
        </Link>
        ). It demonstrates all three collection types: Search, Vector, and Time
        Series.
      </p>

      <details className="group">
        <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
          <span className="pl-1">How does this work?</span>
        </summary>
        <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 text-xs space-y-2">
          <p>
            <b>Search tab:</b> Full-text keyword search with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1">multi_match</code>,
            faceted aggregations, and highlighting.
          </p>
          <p>
            <b>Vector tab:</b> Semantic search using k-NN with 384-dimensional
            embeddings (all-MiniLM-L6-v2). Matches by meaning, not keywords.
          </p>
          <p>
            <b>Time Series tab:</b> Log analytics with date_histogram
            aggregations for latency and error rate visualization.
          </p>
        </div>
      </details>
    </div>
  );
}
