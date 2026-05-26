export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  genre: string;
  plot: string;
}

export interface SearchResult {
  movies: Movie[];
  total: number;
  took: number;
}
