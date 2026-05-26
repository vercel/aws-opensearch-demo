import type { Movie } from "@/lib/types";

export function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <ul className="space-y-4">
      {movies.map((movie) => (
        <li
          key={movie.id}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-500">
                {movie.director} &middot; {movie.year} &middot; {movie.genre}
              </p>
            </div>
          </div>
          {movie.plot && (
            <p className="mt-2 text-sm text-gray-700">{movie.plot}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
