import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, registerSession, AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = body.username || "";
  const password = body.password || "";

  if (!verifyCredentials(username, password)) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const token = createSessionToken();
  registerSession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
