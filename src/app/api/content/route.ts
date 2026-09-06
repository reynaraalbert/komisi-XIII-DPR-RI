import { NextResponse } from "next/server";
import { readAllCms } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

/**
 * Public bulk endpoint — returns the full content dataset without requiring
 * authentication. Used by public pages (server components) to render edits in
 * real time. Content is non-sensitive editorial data.
 */
export async function GET() {
  return NextResponse.json(readAllCms());
}
