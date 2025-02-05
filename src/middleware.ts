import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicPaths = ["/", /^\/[A-Za-z0-9]{6}$/];

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 