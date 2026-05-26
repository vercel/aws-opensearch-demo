import { Brain } from "lucide-react";

export default function VectorPage() {
  return (
    <div className="space-y-6">
      <div className="text-sm border border-dashed border-gray-300 dark:border-gray-600 p-4 bg-white dark:bg-gray-900 rounded">
        <p className="text-gray-800 dark:text-gray-200">
          <b className="font-bold">AI Fashion Assistant</b> — powered by
          OpenSearch Serverless (Vector collection) with semantic embeddings.
        </p>
        <p className="text-gray-500 mt-2 text-xs">
          Describe what you&apos;re looking for in natural language. The system
          converts your query into a vector embedding and finds the most
          semantically similar items using k-NN search.
        </p>
      </div>

      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="text-center space-y-3">
          <Brain className="w-12 h-12 mx-auto opacity-30" />
          <p className="text-sm">Vector search coming soon</p>
          <p className="text-xs text-gray-400">
            Collection: 9i1yy3zrca5efg16vasa.us-east-1.aoss.amazonaws.com
          </p>
        </div>
      </div>
    </div>
  );
}
