import { expect, test } from "@playwright/test";
import { NextRequest } from "next/server";
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  OPTIONS,
} from "../app/api/v1/[...path]/route";

const originalFetch = globalThis.fetch;
test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("dashboard proxy refuses agent operations with the standard error envelope", async () => {
  globalThis.fetch = async () => {
    throw new Error("Must not reach the backend");
  };
  const response = await POST(
    new NextRequest("http://localhost:3100/api/v1/products", {
      method: "POST",
    }),
    { params: Promise.resolve({ path: ["products"] }) },
  );
  expect(response.status).toBe(405);
  expect(await response.json()).toEqual({
    error: {
      code: "unsupported_dashboard_action",
      message: "Use the CLI for marketplace operations",
      details: null,
    },
    status_code: 405,
  });
});

for (const [method, handler] of Object.entries({
  PUT,
  PATCH,
  DELETE,
  OPTIONS,
})) {
  test(`${method} is rejected as JSON instead of a framework-generated empty error`, async () => {
    globalThis.fetch = async () => {
      throw new Error("Must not reach the backend");
    };
    const response = await handler(
      new NextRequest("http://localhost:3100/api/v1/products", { method }),
      { params: Promise.resolve({ path: ["products"] }) },
    );
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD, POST");
    expect(await response.json()).toMatchObject({
      error: { code: "unsupported_dashboard_action", details: null },
      status_code: 405,
    });
  });
}

test("backend connection failures use a structured status-matching envelope", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("connect ECONNREFUSED");
  };
  const response = await GET(
    new NextRequest("http://localhost:3100/api/v1/products"),
    { params: Promise.resolve({ path: ["products"] }) },
  );
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    error: {
      code: "backend_unavailable",
      message: "The marketplace API is unavailable. Please retry.",
      details: null,
    },
    status_code: 503,
  });
});

test("proxy preserves upstream envelopes, status and cookies for approved browser operations", async () => {
  const body = { offer_id: "offer-1", expected_version: 3 };
  const envelope = {
    error: {
      code: "version_conflict",
      message: "Review the current offer",
      details: null,
    },
    status_code: 409,
  };
  globalThis.fetch = async (input, init) => {
    expect(String(input)).toMatch(/\/api\/v1\/approvals\/room-1\/approve$/);
    expect(init?.method).toBe("POST");
    expect(init?.cache).toBe("no-store");
    const headers = new Headers(init?.headers);
    expect(headers.get("cookie")).toBe("market_session=browser-session");
    expect(headers.get("origin")).toBe("http://localhost:3100");
    expect(headers.get("x-csrf-token")).toBe("csrf-value");
    expect(headers.get("x-workspace-id")).toBe("buyer-workspace");
    expect(headers.has("authorization")).toBe(false);
    expect(await new Response(init?.body).json()).toEqual(body);
    const outgoing = new Headers({ "content-type": "application/json" });
    outgoing.append(
      "set-cookie",
      "market_session=renewed; HttpOnly; SameSite=Strict",
    );
    outgoing.append("set-cookie", "market_csrf=renewed-csrf; SameSite=Strict");
    return new Response(JSON.stringify(envelope), {
      status: 409,
      headers: outgoing,
    });
  };
  const response = await POST(
    new NextRequest("http://localhost:3100/api/v1/approvals/room-1/approve", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "market_session=browser-session",
        origin: "http://localhost:3100",
        "x-csrf-token": "csrf-value",
        "x-workspace-id": "buyer-workspace",
        authorization: "Bearer never-forward-agent-token",
      },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ path: ["approvals", "room-1", "approve"] }) },
  );
  expect(response.status).toBe(409);
  expect(await response.json()).toEqual(envelope);
  expect(response.headers.getSetCookie()).toEqual([
    "market_session=renewed; HttpOnly; SameSite=Strict",
    "market_csrf=renewed-csrf; SameSite=Strict",
  ]);
});

test("image proxy preserves binary bytes, content type and workspace query", async () => {
  const bytes = new Uint8Array([255, 216, 255, 217]);
  globalThis.fetch = async (input) => {
    expect(String(input)).toMatch(
      /\/api\/v1\/images\/image-1\/content\?thumbnail=true&workspace_id=buyer-workspace$/,
    );
    return new Response(bytes, {
      headers: {
        "content-type": "image/jpeg",
        "content-disposition": 'inline; filename="image-1.jpg"',
      },
    });
  };
  const response = await GET(
    new NextRequest(
      "http://localhost:3100/api/v1/images/image-1/content?thumbnail=true&workspace_id=buyer-workspace",
    ),
    { params: Promise.resolve({ path: ["images", "image-1", "content"] }) },
  );
  expect(response.headers.get("content-type")).toBe("image/jpeg");
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
});
