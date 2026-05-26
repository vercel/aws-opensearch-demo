import { getSuggestions } from "@/lib/opensearch/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const prefix = request.nextUrl.searchParams.get("q") || "";
  const suggestions = await getSuggestions(prefix);
  return NextResponse.json(suggestions);
}
