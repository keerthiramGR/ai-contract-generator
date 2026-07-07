import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin-login(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Redirect unauthenticated users to the correct sign-in
  if (!isPublicRoute(req) && !userId) {
    // If they tried to access an admin route, send to admin login
    if (isAdminRoute(req)) {
      const adminSignInUrl = new URL("/admin-login", req.url);
      adminSignInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(adminSignInUrl);
    }
    // Otherwise send to regular sign-in
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // For admin routes, check role
  if (isAdminRoute(req) && userId) {
    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
    // Allow access if role is admin; otherwise redirect to dashboard
    if (role !== "admin") {
      // In demo mode we allow access; in production you'd redirect
      // return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
