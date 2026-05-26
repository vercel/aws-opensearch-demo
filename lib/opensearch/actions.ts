"use server";

import { Movie } from "@/lib/opensearch/queries";
import { client } from "./client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 } from "./uuid";

const INDEX_NAME = "movies";

export async function voteAction(
  movie: Movie,
  score: number,
  lastVoteTime: Date,
) {
  const cookieStore = await cookies();

  let sessionId: string | undefined = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    sessionId = v4();
    cookieStore.set("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  // Check if user already voted
  const doc = await client.get({
    index: INDEX_NAME,
    id: String(movie.id),
  });

  const voters: string[] = doc.body._source.voters || [];
  if (voters.includes(sessionId)) {
    return movie;
  }

  // Update the document with new score and voter
  await client.update({
    index: INDEX_NAME,
    id: String(movie.id),
    body: {
      doc: {
        score,
        last_vote_time: lastVoteTime.toISOString(),
        voters: [...voters, sessionId],
      },
    },
    refresh: true,
  });

  revalidatePath("/");
}
