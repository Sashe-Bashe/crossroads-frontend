export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");
export type Listing = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  priceCents: number;
  currency: string;
  deliveryDays: number;
  verified: boolean;
};
export type RFQ = {
  id: string;
  buyerId: string;
  listingId: string;
  title: string;
  description: string;
  budgetCents: number;
  currency: string;
  deadline: string;
  acceptanceCriteria: string;
  status: string;
  createdAt: string;
};
export type Quote = {
  id: string;
  rfqId: string;
  sellerId: string;
  scope: string;
  totalCents: number;
  currency: string;
  deliveryDays: number;
  expiresAt: string;
  termsVersion: string;
  version: number;
  status: string;
};
export type Preview = {
  id: string;
  quoteId: string;
  buyerId: string;
  sellerId: string;
  scope: string;
  totalCents: number;
  currency: string;
  deliveryDays: number;
  termsVersion: string;
  quoteVersion: number;
  snapshotHash: string;
  expiresAt: string;
  acceptanceCriteria: string;
  deadline: string;
  termsText: string;
  feesCents: number;
  taxesCents: number;
};
export type Approval = {
  id: string;
  previewId: string;
  status: string;
  payloadHash: string;
  preview?: Preview;
};
export type Order = {
  id: string;
  buyerId: string;
  sellerId: string;
  scope: string;
  totalCents: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  deliveryUrl?: string;
  deliveryNotes?: string;
  disputes?: {
    id: string;
    reason: string;
    status: string;
    createdAt: string;
  }[];
};
export type Actor = {
  id: string;
  organizationId: string;
  kind: string;
  role: string;
};
export type Audit = {
  id: string;
  actorId: string;
  organizationId: string;
  action: string;
  resourceId: string;
  createdAt: string;
};
export async function api<T>(
  token: string,
  path: string,
  body?: unknown,
  key?: string,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/v1${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(key ? { "Idempotency-Key": key } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Cannot reach the demo API. Check the backend, API URL, and CORS configuration, then retry.",
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      data?.error?.message
        ? `${data.error.code}: ${data.error.message}`
        : `Request failed (${response.status})`,
    );
  return data as T;
}
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export function cents(value: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(value))
    throw new Error("Enter a USD amount with at most two decimal places.");
  const [whole, fraction = ""] = value.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(result) || result <= 0)
    throw new Error("Amount must be positive and within the supported range.");
  return result;
}
export const date = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const safeUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
};
