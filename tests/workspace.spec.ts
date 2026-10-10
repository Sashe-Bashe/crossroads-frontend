import { test, expect } from "@playwright/test";
const password = process.env.DEMO_PASSWORD || "local-market-demo";
async function login(page: import("@playwright/test").Page, email: string) {
  await page.goto("/");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Open workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Your commerce, in view." }),
  ).toBeVisible();
}
test("buyer and seller review the same offer and approve through the UI", async ({
  page,
  browser,
}) => {
  await login(page, "buyer@demo.local");
  await page.getByRole("button", { name: /^Products$/ }).click();
  await expect(
    page.getByRole("heading", { name: "The product catalogue." }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Arc stack chair/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").locator(".gallery-main img"),
  ).toHaveJSProperty("complete", true);
  await page
    .getByRole("button", { name: "Side illustration", exact: true })
    .click();
  await page.getByRole("button", { name: "Close details" }).click();
  await page.getByRole("button", { name: /^Approvals/ }).click();
  const row = page
    .locator("tbody tr")
    .filter({ hasText: "CLI demonstration" })
    .first();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Review" }).click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("€6,880.00");
  await expect(
    modal.getByRole("button", { name: "Approve exact offer" }),
  ).toBeDisabled();
  await modal.getByRole("checkbox").check();
  await modal.getByRole("button", { name: "Approve exact offer" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your approval is recorded",
  );
  await page.getByRole("button", { name: "Close details" }).click();
  await page.screenshot({
    path: "test-results/buyer-approvals-desktop.png",
    fullPage: true,
  });
  const sellerContext = await browser.newContext();
  const seller = await sellerContext.newPage();
  await login(seller, "forma@demo.local");
  await expect(
    seller.getByRole("button", { name: "Requests", exact: true }),
  ).toHaveCount(0);
  await seller.getByRole("button", { name: /^Approvals/ }).click();
  await seller
    .locator("tbody tr")
    .filter({ hasText: "80 chairs for Sofia" })
    .first()
    .getByRole("button", { name: "Review" })
    .click();
  await seller.getByRole("dialog").getByRole("checkbox").check();
  await seller.getByRole("button", { name: "Approve exact offer" }).click();
  await expect(seller.getByRole("status")).toContainText(
    "Your demo order is confirmed",
  );
  await seller.getByRole("button", { name: "Close details" }).click();
  await page.getByRole("button", { name: "Orders", exact: true }).click();
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.locator("tbody")).toContainText("€6,880.00");
  await page.getByRole("button", { name: "View order" }).first().click();
  await expect(page.getByRole("dialog")).toContainText("Buyer approval");
  await expect(page.getByRole("dialog")).toContainText("Seller approval");
  await page.getByRole("button", { name: "Close details" }).click();
  await page.reload();
  await expect(page.locator("tbody")).toContainText("€6,880.00");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/orders-mobile.png",
    fullPage: true,
  });
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 390);
  await sellerContext.close();
});
