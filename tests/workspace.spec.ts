import { expect, test, type Page } from "@playwright/test";

const future = () => new Date(Date.now() + 14 * 86_400_000).toISOString();
const listing = {
  id: "catalog-cleanup",
  sellerId: "seller-org",
  title: "Product catalog normalization",
  description: "Normalize records and flag duplicates.",
  category: "catalog-data",
  priceCents: 35000,
  currency: "USD",
  deliveryDays: 3,
  verified: true,
};
const preview = {
  id: "preview-1",
  quoteId: "quote-1",
  buyerId: "buyer-org",
  sellerId: "seller-org",
  scope: "Normalize 5000 records",
  totalCents: 35000,
  currency: "USD",
  deliveryDays: 3,
  termsVersion: "demo-catalog-v1",
  quoteVersion: 1,
  snapshotHash: "transaction-hash",
  expiresAt: future(),
  acceptanceCriteria: "Valid CSV with duplicate report",
  deadline: future(),
  termsText: "No supplier model training on buyer data.",
  feesCents: 0,
  taxesCents: 0,
};

async function fixture(page: Page, approvalStatus?: string) {
  let status = approvalStatus;
  await page.route("**/v1/**", async (route) => {
    const request = route.request(),
      path = new URL(request.url()).pathname;
    const agent = request.headers().authorization === "Bearer demo-agent-token";
    let body: unknown = [];
    if (path === "/v1/me")
      body = {
        id: agent ? "buyer-agent" : "buyer-human",
        organizationId: "buyer-org",
        kind: agent ? "agent" : "human",
        role: "approver",
      };
    if (path === "/v1/listings") body = [listing];
    if (path === "/v1/approvals")
      body = status
        ? [
            {
              id: "approval-1",
              previewId: preview.id,
              status,
              payloadHash: preview.snapshotHash,
              preview,
            },
          ]
        : [];
    if (path === "/v1/approvals/approval-1/approve") {
      status = "approved";
      body = { id: "approval-1", status };
    }
    await route.fulfill({
      json: body,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  });
}

test("responsive marketplace loads API listings and filters without horizontal overflow", async ({
  page,
}) => {
  await fixture(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Good work starts here." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: listing.title }),
  ).toBeVisible();
  await page
    .locator("nav")
    .getByRole("button", { name: "Marketplace", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search services" })
    .fill("does-not-exist");
  await expect(
    page.getByRole("heading", { name: "No services found" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Search services" }).fill("");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("heading", { name: listing.title }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mobile-marketplace.png",
    fullPage: true,
  });
});

test("human review shows exact terms, criteria and deadline; agents cannot grant approval", async ({
  page,
}) => {
  await fixture(page, "pending");
  await page.goto("/");
  await expect(
    page.getByText("Connected to demo API", { exact: true }),
  ).toBeVisible();
  await page.locator("nav").getByRole("button", { name: "Approvals" }).click();
  await expect(
    page.getByText(preview.termsText, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(preview.acceptanceCriteria, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Delivery deadline", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Approve snapshot" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch identity" }).click();
  await page
    .getByRole("combobox", { name: "Demo identity", exact: true })
    .selectOption("demo-agent-token");
  await expect(
    page.getByText("agent / approver", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Approve snapshot" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Commit order" })).toHaveCount(
    0,
  );
});

test("ambiguous order failure keeps the same idempotency key for a manual retry", async ({
  page,
}) => {
  await fixture(page, "approved");
  const keys: string[] = [];
  await page.route("**/v1/orders", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: [] });
    keys.push(route.request().headers()["idempotency-key"]);
    if (keys.length === 1) return route.abort("failed");
    await route.fulfill({ json: { id: "order-1" } });
  });
  await page.goto("/");
  await expect(
    page.getByText("Connected to demo API", { exact: true }),
  ).toBeVisible();
  await page.locator("nav").getByRole("button", { name: "Approvals" }).click();
  await page.getByRole("button", { name: "Commit order" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Cannot reach",
  );
  await page.getByRole("button", { name: "Commit order" }).click();
  await expect(
    page.getByRole("heading", { name: "Every delivery, in view." }),
  ).toBeVisible();
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);
});

test("unavailable API displays a recoverable connection error", async ({
  page,
}) => {
  await page.route("**/v1/**", (route) => route.abort("failed"));
  await page.goto("/");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Cannot reach the demo API",
  );
  await expect(
    page.getByText("Awaiting API connection", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "New request", exact: true }),
  ).toBeDisabled();
});
