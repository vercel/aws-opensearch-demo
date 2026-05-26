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
