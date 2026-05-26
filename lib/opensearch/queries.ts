import { client } from "./client";
import { performance } from "perf_hooks";

const INDEX_NAME = "movies";

export interface Movie {
  id: number;
  title: string;
  score: number;
  lastVoteTime: Date;
  hasVoted: boolean;
}

export interface MoviesResult {
  movies: Movie[];
  totalRecords: number;
  queryTimeMs: string;
}

export async function getMovies(
  sessionId?: string,
  filter?: string,
): Promise<MoviesResult> {
  const startTime = performance.now();

  let query: any = { match_all: {} };

  if (filter) {
    query = {
      multi_match: {
        query: filter,
        fields: ["title^3"],
        fuzziness: "AUTO",
      },
    };
  }

  const response = await client.search({
    index: INDEX_NAME,
    body: {
      query,
      sort: [{ score: { order: "desc" } }, { "title.keyword": { order: "asc" } }],
      size: 8,
    },
  });

  const hits = response.body.hits;
  const totalRecords =
    typeof hits.total === "number" ? hits.total : hits.total.value;

  const movies: Movie[] = hits.hits.map((hit: any) => ({
    id: hit._source.id,
    title: hit._source.title,
    score: hit._source.score,
    lastVoteTime: new Date(hit._source.last_vote_time),
    hasVoted: sessionId
      ? (hit._source.voters || []).includes(sessionId)
      : false,
  }));

  const endTime = performance.now();
  const queryTimeMs = (endTime - startTime).toFixed(2);

  console.log(`OpenSearch query took ${queryTimeMs} ms`);

  return { movies, totalRecords, queryTimeMs };
}
