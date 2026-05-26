import { BarChart3 } from "lucide-react";

export default function TimeSeriesPage() {
  return (
    <div className="space-y-6">
      <div className="text-sm border border-dashed border-gray-300 dark:border-gray-600 p-4 bg-white dark:bg-gray-900 rounded">
        <p className="text-gray-800 dark:text-gray-200">
          <b className="font-bold">Application Performance Monitor</b> — powered
          by OpenSearch Serverless (Time Series collection) with date_histogram
          aggregations.
        </p>
        <p className="text-gray-500 mt-2 text-xs">
          Ingest application logs and visualize latency percentiles, error rates,
          and service health over time — all computed server-side by OpenSearch.
        </p>
      </div>

      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="text-center space-y-3">
          <BarChart3 className="w-12 h-12 mx-auto opacity-30" />
          <p className="text-sm">Time series dashboard coming soon</p>
          <p className="text-xs text-gray-400">
            Needs a Time Series AOSS collection
          </p>
        </div>
      </div>
    </div>
  );
}
