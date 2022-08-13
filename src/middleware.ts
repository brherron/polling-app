import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  if (req.cookies.get("poll-token")) return;

  const rand = nanoid();

  const response = NextResponse.next();
  response.cookies.set("poll-token", rand, { sameSite: "strict" });

  return response;
}