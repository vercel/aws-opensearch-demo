import { SearchForm } from "@/components/search-form";
import { MovieList } from "@/components/movie-list";
import { searchMovies } from "@/app/actions";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const results = query ? await searchMovies(query) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Next.js + Amazon OpenSearch
        </h1>
        <p className="text-gray-600">
          Full-text search powered by Amazon OpenSearch Service
        </p>
      </div>

      <SearchForm initialQuery={query} />

      {results && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-gray-500">
            {results.total} result{results.total !== 1 ? "s" : ""} in{" "}
            {results.took}ms
          </p>
          <MovieList movies={results.movies} />
        </div>
      )}

      {query && results && results.total === 0 && (
        <p className="mt-8 text-center text-gray-500">
          No movies found for &ldquo;{query}&rdquo;
        </p>
      )}
    </main>
  );
}
