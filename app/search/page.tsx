import { Suspense } from "react";
import { searchRecipes } from "@/lib/opensearch/queries";
import { SearchInterface } from "@/components/search-interface";
import Loading from "@/components/loading";

type Props = {
  searchParams: Promise<{
    q?: string;
    cuisine?: string;
    diet?: string;
    time?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: Props) {
  const params = await searchParams;
  const result = await searchRecipes({
    query: params.q || undefined,
    cuisine: params.cuisine || undefined,
    diet: params.diet || undefined,
    maxCookTime: params.time ? parseInt(params.time) : undefined,
  });

  return (
    <SearchInterface
      initialQuery={params.q || ""}
      initialCuisine={params.cuisine || ""}
      initialDiet={params.diet || ""}
      initialTime={params.time || ""}
      result={result}
    />
  );
}
