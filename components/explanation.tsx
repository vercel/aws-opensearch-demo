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
        />
      </div>
      <p className="mb-2">
        This app uses <b className="font-bold">Amazon OpenSearch Service</b>{" "}
        with Next.js and Vercel (
        <Link
          href="https://github.com/KishoreKicha14/aws-opensearch-demo"
          target="_blank"
          rel="noreferrer"
          className="text-gray-900 dark:text-white border-b border-gray-900 dark:border-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          view source
        </Link>
        ).
      </p>

      <details className="group mb-2">
        <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
          <span className="pl-1">How does this work?</span>
        </summary>
        <p className="p-5 mt-2 bg-gray-100 dark:bg-gray-800">
          Recipes are indexed in OpenSearch with full-text search capabilities.
          The search uses{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1">multi_match</code>{" "}
          with field boosting and fuzzy matching. Faceted filters use{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1">aggregations</code>{" "}
          to show real-time counts. Matching terms are highlighted using
          OpenSearch&apos;s built-in{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1">highlight</code>{" "}
          API. Autocomplete uses{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1">
            match_phrase_prefix
          </code>{" "}
          for prefix matching.
        </p>
      </details>

      <details className="group">
        <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
          <span className="pl-1">Why OpenSearch for search?</span>
        </summary>
        <p className="p-5 mt-2 bg-gray-100 dark:bg-gray-800">
          Unlike relational databases that use B-tree indices, OpenSearch uses
          inverted indices optimized for full-text search. This enables
          sub-millisecond relevance-scored queries, fuzzy matching for typo
          tolerance, faceted aggregations without GROUP BY overhead, and
          built-in highlighting of matched terms.{" "}
          <Link
            href="https://aws.amazon.com/opensearch-service/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-900 dark:text-white border-b border-gray-900 dark:border-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Learn more.
          </Link>
        </p>
      </details>
    </div>
  );
}
