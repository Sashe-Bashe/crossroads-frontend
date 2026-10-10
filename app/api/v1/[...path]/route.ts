import { NextRequest } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  if (
    req.method === "POST" &&
    !/^(auth\/(session|logout)|approvals\/[^/]+\/(approve|reject))$/.test(route)
  ) {
    return Response.json(
      {
        error: {
          code: "unsupported_dashboard_action",
          message: "Use the CLI for marketplace operations",
        },
      },
      { status: 405 },
    );
  }
  const headers = new Headers();
  for (const name of [
    "cookie",
    "content-type",
    "origin",
    "x-csrf-token",
    "x-workspace-id",
  ]) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const upstream = await fetch(
      `${process.env.API_INTERNAL_URL || "http://127.0.0.1:8100"}/api/v1/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`,
      {
        method: req.method,
        headers,
        body: req.method === "GET" ? undefined : await req.arrayBuffer(),
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(30000),
      },
    );
    const outgoing = new Headers({
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    for (const name of ["content-type", "content-disposition"]) {
      const value = upstream.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    for (const cookie of upstream.headers.getSetCookie())
      outgoing.append("set-cookie", cookie);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: outgoing,
    });
  } catch {
    return Response.json(
      {
        error: {
          code: "backend_unavailable",
          message: "The marketplace API is unavailable. Please retry.",
        },
      },
      { status: 503 },
    );
  }
}
export { proxy as GET, proxy as POST };
