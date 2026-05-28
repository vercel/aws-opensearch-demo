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
        ). It demonstrates full-text recipe search with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1">multi_match</code>,
        faceted aggregations, and highlighting.
      </p>
    </div>
  );
}
