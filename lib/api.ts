export type ImageAsset = {
  id: string;
  status: string;
  mime: string;
  width: number;
  height: number;
  caption: string;
  content_path: string;
  thumbnail_path: string;
};
export type Product = {
  id: string;
  name: string;
  description: string;
  sku: string;
  supplier: string;
  workspace_id: string;
  stock: number;
  version: number;
  published: boolean;
  unit_price: number;
  delivery_charge: number;
  lead_days: number;
  destinations: string[];
  attributes: { material: string; stackable: boolean; color: string };
  cover_id: string | null;
  images: ImageAsset[];
};
export type PurchaseRequest = {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  state: string;
  quantity: number;
  material: string;
  stackable: boolean;
  destination: string;
  latest_delivery: string;
  max_total?: number;
  max_deposit_percent?: number;
  preference?: string;
  matches?: {
    product_id: string;
    supplier: string;
    eligible: boolean;
    reasons: string[];
  }[];
};
export type Terms = {
  unit_price: number;
  quantity: number;
  total: number;
  delivery_charge: number;
  deposit_percent: number;
  delivery_date: string;
  currency: string;
};
export type Offer = {
  id: string;
  version: number;
  sender: string;
  terms: Terms;
  product: Product;
  expires_at: string;
  approvals: { workspace_id: string; user_id: string; at: string }[];
};
export type Room = {
  id: string;
  request_id: string;
  supplier: string;
  seller_id: string;
  product_id: string;
  state: string;
  version: number;
  next_role: string;
  reason: string | null;
  agent_status: string;
  request: PurchaseRequest;
  product: Product;
  current_offer: Offer | null;
  offers: Offer[];
  valid: boolean;
  invalid_reasons: string[];
  approval_url: string;
  activity: {
    id: string;
    role: string;
    type: string;
    data: Record<string, unknown>;
    at: string;
  }[];
};
export type Order = {
  id: string;
  request_id: string;
  room_id: string;
  buyer_id: string;
  seller_id: string;
  buyer: string;
  seller: string;
  status: string;
  created_at: string;
  offer: Offer;
};
export type AuditEvent = {
  id: string;
  actor_id: string;
  type: string;
  resource_id: string;
  data: Record<string, unknown>;
  at: string;
};
export type Workspace = { id: string; name: string; role: "buyer" | "seller" };
export type Me = {
  user: { name: string; email: string };
  workspace: Workspace;
  credential: { kind: string; scopes: string[] };
  can_approve: boolean;
  demo: boolean;
};
export const money = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
export const human = (value: string) => value.replaceAll("_", " ");
export function setWorkspace(id: string) {
  localStorage.setItem("market_workspace", id);
}
export async function api<T>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const workspace = localStorage.getItem("market_workspace");
  if (workspace) headers["X-Workspace-ID"] = workspace;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    headers["X-CSRF-Token"] = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("market_csrf="))
        ?.split("=")
        .slice(1)
        .join("=") || "",
    );
  }
  const res = await fetch(`/api/v1${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
    cache: "no-store",
  });
  const value = await res.json();
  if (!res.ok)
    throw new Error(value.error?.message || `Request failed (${res.status})`);
  return value;
}
export function imageUrl(image: ImageAsset, thumb = false) {
  const path = thumb ? image.thumbnail_path : image.content_path;
  const wid = localStorage.getItem("market_workspace") || "";
  return `/api/v1${path}${path.includes("?") ? "&" : "?"}workspace_id=${encodeURIComponent(wid)}`;
}
