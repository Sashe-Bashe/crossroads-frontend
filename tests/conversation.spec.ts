import { expect, test } from "@playwright/test";
import { mockMarketplace } from "./fixtures/guidance";
import { conversationRoom } from "./fixtures/conversation";

for (const role of ["buyer", "seller"] as const) {
  test(`${role} sees its immutable order needs review from the order's scoped snapshot`, async ({
    page,
  }) => {
    const state = await mockMarketplace(page, role);
    const room = (state.rooms[role] = conversationRoom(role));
    const offer = structuredClone(room.current_offer!);
    offer.private_brief_review = null;
    state.orders[role] = [
      {
        id: "order-1",
        request_id: room.request_id,
        room_id: room.id,
        buyer_id: "buyer-workspace",
        seller_id: "seller-workspace",
        buyer: "Chair buyer",
        seller: "Chair seller",
        status: "confirmed_demo",
        created_at: "2026-10-10T10:00:00Z",
        offer,
        private_brief_review: room.current_offer!.private_brief_review,
        shared_brief_review: room.current_offer!.shared_brief_review,
      },
    ];
    await page.goto("/?view=orders");
    await page.getByRole("button", { name: "View order", exact: true }).click();
    await page
      .getByText("Needs reviewed with offer v1", { exact: true })
      .click();
    const review = page.getByRole("region", {
      name: "Your needs recorded with this offer",
    });
    await expect(review).toContainText(`Private ${role} goal`);
    await expect(review).toContainText("Waived by owner");
    await expect(review).toContainText("Extended warranty preference");
    await expect(review).toContainText("Unverified");
    await expect(page.getByRole("dialog")).not.toContainText(
      role === "buyer" ? "Private seller goal" : "Private buyer goal",
    );
  });

  test(`${role} reads actual shared dialogue, evidence and an exact offer without leaking private needs`, async ({
    page,
  }) => {
    const state = await mockMarketplace(page, role);
    state.rooms.buyer = conversationRoom("buyer");
    state.rooms.seller = conversationRoom("seller");
    await page.goto("/?view=approvals&room=room-1");
    const conversation = page.getByRole("region", {
      name: "Shared negotiation conversation",
      exact: true,
    });
    await expect(conversation).toContainText(
      "We need eight chairs before the opening",
    );
    await expect(conversation).toContainText(
      "Could you improve the total while keeping that delivery date?",
    );
    await expect(conversation.locator("blockquote")).toContainText(
      "Can you deliver by 24 October?",
    );
    await expect(
      conversation.getByRole("link", { name: "Woven back detail" }),
    ).toHaveAttribute("href", /image-1\/content\?workspace_id=/);
    await expect(
      conversation.getByRole("img", { name: "Woven back detail" }),
    ).toHaveJSProperty("complete", true);
    await expect(
      conversation.getByLabel("Offer version 1").first(),
    ).toContainText("€1,180.00");
    await expect(
      conversation.getByLabel("Offer version 1").first(),
    ).toContainText("€240.00");
    await conversation
      .getByText("Needs shared with both businesses", { exact: true })
      .click();
    await expect(conversation).toContainText("Delivery before the opening");
    await expect(conversation).not.toContainText("Private buyer");
    await expect(conversation).not.toContainText("Private seller");
    const ownBrief = page.getByRole("region", {
      name: "Your private negotiation brief",
      exact: true,
    });
    await expect(ownBrief).toContainText(`Private ${role} goal`);
    await expect(page.getByRole("dialog")).not.toContainText(
      role === "buyer" ? "Private seller goal" : "Private buyer goal",
    );
    await expect(ownBrief).toContainText("Waived by owner");
    await expect(ownBrief).toContainText(
      "The owner will arrange assembly separately.",
    );
    await expect(ownBrief).toContainText("Extended warranty preference");
    await expect(ownBrief).toContainText("Unverified");
    await page
      .getByText("Needs reviewed with offer v1", { exact: true })
      .click();
    await expect(
      page.getByRole("region", { name: "Your needs recorded with this offer" }),
    ).toContainText(`Private ${role} goal`);
    await expect(page.getByRole("dialog")).toContainText(
      "Both agents agreed. Each business must now review and approve this offer.",
    );
    await expect(
      page.getByRole("button", { name: "Approve exact offer" }),
    ).toBeDisabled();
    expect(state.submissions).toHaveLength(0);
  });
}

test("own private human questions are answered through guidance and never appear in shared dialogue", async ({
  page,
}) => {
  const state = await mockMarketplace(page);
  const room = (state.rooms.buyer = conversationRoom("buyer"));
  room.state = "needs_human_review";
  room.human_questions = [
    {
      id: "question-1",
      question:
        "Private buyer question: may I waive assembly to meet our budget?",
      status: "pending",
      created_at: "2026-10-10T09:06:00Z",
      answered_at: null,
      answer_guidance_id: null,
    },
  ];
  room.activity.push({
    id: "message-6",
    role: "buyer",
    type: "request_human_review",
    run: 1,
    at: "2026-10-10T09:06:00Z",
    data: { image_ids: [] },
  });
  await page.goto("/?view=negotiations&room=room-1");
  const questions = page.getByRole("region", {
    name: "Private questions from your agent",
  });
  await expect(questions).toContainText("Private buyer question");
  await expect(
    page.getByRole("region", {
      name: "Shared negotiation conversation",
      exact: true,
    }),
  ).not.toContainText("Private buyer question");
  await questions
    .getByRole("button", { name: "Reply privately to my agent" })
    .click();
  await page
    .getByRole("textbox", { name: "Tell your agent what to try" })
    .fill(
      "Do not waive assembly. Ask me to update the brief if this cannot be met.",
    );
  await page.getByRole("button", { name: "Send to my agent" }).click();
  await expect(questions).toContainText("Answered privately");
  await expect(
    page.getByRole("region", {
      name: "Shared negotiation conversation",
      exact: true,
    }),
  ).not.toContainText("Do not waive assembly");
  expect(state.submissions[0]!.body.instruction).toBe(
    "Do not waive assembly. Ask me to update the brief if this cannot be met.",
  );
});

test("unmet must-haves block approval and current brief changes do not rewrite the offer review", async ({
  page,
}) => {
  const state = await mockMarketplace(page);
  const room = (state.rooms.buyer = conversationRoom("buyer"));
  const oldGoal = room.private_brief.goals;
  room.private_brief.goals =
    "Our current private goal changed after this offer.";
  room.private_brief.version = 3;
  const assembly = room.private_brief.requirements.find(
    (need) => need.id === "installation",
  )!;
  assembly.resolution = "open";
  assembly.resolution_note = null;
  assembly.status = "unverified";
  assembly.blocks_agreement = true;
  room.requirement_blockers = [
    "Assembly service needs an owner decision before agreement",
  ];
  room.valid = false;
  room.invalid_reasons = ["Current requirements need review"];
  await page.goto("/?view=approvals&room=room-1");
  const ownBrief = page.getByRole("region", {
    name: "Your private negotiation brief",
    exact: true,
  });
  await expect(ownBrief).toContainText("Our current private goal changed");
  await expect(ownBrief).toContainText("Blocks agreement");
  await expect(ownBrief.getByRole("status")).toContainText(
    "Assembly service needs an owner decision",
  );
  await page.getByText("Needs reviewed with offer v1", { exact: true }).click();
  const savedReview = page.getByRole("region", {
    name: "Your needs recorded with this offer",
  });
  await expect(savedReview).toContainText(oldGoal);
  await expect(savedReview).toContainText("Waived by owner");
  await expect(savedReview).not.toContainText(
    "Our current private goal changed",
  );
  await page.getByRole("checkbox").check();
  await expect(
    page.getByRole("button", { name: "Approve exact offer" }),
  ).toBeDisabled();
});

test("conversation renders hostile text safely and keeps public and private content inside a mobile dialog", async ({
  page,
}) => {
  const state = await mockMarketplace(page);
  const room = (state.rooms.buyer = conversationRoom("buyer"));
  room.activity[0]!.data.message =
    "<img src=x onerror=alert('unsafe')> " + "longword".repeat(100);
  room.activity.push({
    id: "owner-1",
    role: "buyer",
    type: "human_requested_negotiation",
    run: 2,
    at: "2026-10-10T09:08:00Z",
    data: { image_ids: [] },
  });
  room.private_brief.goals += " " + "privatelongword".repeat(100);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?view=negotiations&room=room-1");
  const modal = page.getByRole("dialog");
  const conversation = page.getByRole("region", {
    name: "Shared negotiation conversation",
    exact: true,
  });
  await expect(conversation).toContainText(
    "<img src=x onerror=alert('unsafe')>",
  );
  await expect(conversation.locator("img[onerror], script")).toHaveCount(0);
  await expect(conversation.locator("#message-owner-1")).toContainText(
    "buyer workspace",
  );
  await expect(conversation.locator("#message-owner-1")).not.toContainText(
    "buyer agent",
  );
  const bounds = await modal.boundingBox();
  for (const element of await modal
    .locator(
      ".conversation, .conversation-entry, .conversation-offer, .private-brief, .need",
    )
    .all()) {
    const rect = await element.boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(bounds!.x);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(
      bounds!.x + bounds!.width,
    );
  }
  expect(await modal.evaluate((element) => element.scrollWidth)).toBe(
    await modal.evaluate((element) => element.clientWidth),
  );
});

test("switching workspaces clears private brief and questions while retaining shared messages", async ({
  page,
}) => {
  const state = await mockMarketplace(page);
  state.rooms.buyer = conversationRoom("buyer");
  state.rooms.seller = conversationRoom("seller");
  state.rooms.buyer.human_questions = [
    {
      id: "question-1",
      question: "Private buyer question only",
      status: "pending",
      created_at: "2026-10-10T09:06:00Z",
      answered_at: null,
      answer_guidance_id: null,
    },
  ];
  await page.goto("/?view=negotiations&room=room-1");
  await expect(page.getByRole("dialog")).toContainText(
    "Private buyer question only",
  );
  await page.getByRole("button", { name: "Close details" }).click();
  await page
    .getByRole("combobox", { name: "Workspace" })
    .selectOption("seller-workspace");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Private seller goal");
  await expect(page.getByRole("dialog")).not.toContainText(
    "Private buyer goal",
  );
  await expect(page.getByRole("dialog")).not.toContainText(
    "Private buyer question",
  );
  await expect(
    page.getByRole("region", {
      name: "Shared negotiation conversation",
      exact: true,
    }),
  ).toContainText("Could you improve the total");
});
