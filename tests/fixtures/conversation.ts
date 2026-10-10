import type { Room } from "../../lib/api";
import { exampleRoom } from "./guidance";

type Requirement = Room["private_brief"]["requirements"][number];

export function conversationRoom(role: "buyer" | "seller"): Room {
  const room = exampleRoom();
  const delivery: Requirement = {
    id: "delivery-needed",
    label: "Delivery before the opening",
    kind: "hard",
    field: "delivery_date",
    operator: "lte",
    value: "2026-10-24",
    shareable: true,
    resolution: "open",
    resolution_note: null,
    status: "met",
    evidence: [{ source: "offer", path: "delivery_date", value: "2026-10-22" }],
    blocks_agreement: false,
  };
  const privatePrice: Requirement = {
    id: "price-target",
    label:
      role === "buyer"
        ? "Private buyer spending target"
        : "Private seller margin target",
    kind: "preference",
    field: role === "buyer" ? "total" : "unit_price",
    operator: role === "buyer" ? "lte" : "gte",
    value: role === "buyer" ? 120000 : 10000,
    shareable: false,
    resolution: "open",
    resolution_note: null,
    status: "met",
    evidence: [
      {
        source: "offer",
        path: role === "buyer" ? "total" : "unit_price",
        value: role === "buyer" ? 118000 : 11750,
      },
    ],
    blocks_agreement: false,
  };
  const installation: Requirement = {
    id: "installation",
    label: "Assembly service",
    kind: "hard",
    field: "unsupported",
    operator: "eq",
    value: null,
    shareable: false,
    resolution: "waived",
    resolution_note: "The owner will arrange assembly separately.",
    status: "waived",
    evidence: [],
    blocks_agreement: false,
  };
  const warranty: Requirement = {
    ...installation,
    id: "warranty",
    label: "Extended warranty preference",
    kind: "preference",
    resolution: "open",
    resolution_note: null,
    status: "unverified",
  };
  room.private_brief = {
    version: 2,
    goals: `${role === "buyer" ? "Private buyer goal: keep our budget undisclosed." : "Private seller goal: protect our margin."}`,
    shareable_needs:
      role === "buyer"
        ? "Chairs needed for our October opening."
        : "Supply eight chairs with confirmed delivery.",
    requirements: [delivery, privatePrice, installation, warranty],
  };
  room.shared_briefs = [
    {
      role: "buyer",
      version: 2,
      shareable_needs: "Chairs needed for our October opening.",
      requirements: [delivery],
    },
    {
      role: "seller",
      version: 2,
      shareable_needs: "Supply eight chairs with confirmed delivery.",
      requirements: [],
    },
  ];
  room.current_offer!.private_brief_review = structuredClone(
    room.private_brief,
  );
  room.current_offer!.shared_brief_review = structuredClone(room.shared_briefs);
  room.product.images = [
    {
      id: "image-1",
      product_id: "product-1",
      status: "ready",
      mime: "image/svg+xml",
      width: 40,
      height: 40,
      sha256: "image-checksum",
      position: 0,
      caption: "Woven back detail",
      error: null,
      content_path: "/images/image-1/content",
      thumbnail_path: "/images/image-1/content?thumbnail=true",
    },
  ];
  room.activity = [
    {
      id: "message-1",
      role: "buyer",
      type: "message",
      run: 1,
      at: "2026-10-10T09:00:00Z",
      data: {
        message:
          "We need eight chairs before the opening. Can you deliver by 24 October?",
        purpose: "question",
        image_ids: [],
      },
    },
    {
      id: "message-2",
      role: "seller",
      type: "message",
      run: 1,
      at: "2026-10-10T09:01:00Z",
      data: {
        message:
          "We can deliver on 22 October. This image shows the woven back.",
        purpose: "answer",
        reply_to_action_id: "message-1",
        image_ids: ["image-1"],
      },
    },
    {
      id: "message-3",
      role: "buyer",
      type: "message",
      run: 1,
      at: "2026-10-10T09:02:00Z",
      data: {
        message:
          "Could you improve the total while keeping that delivery date?",
        purpose: "tradeoff",
        image_ids: [],
      },
    },
    {
      id: "message-4",
      role: "seller",
      type: "propose",
      run: 1,
      at: "2026-10-10T09:03:00Z",
      data: {
        offer_id: "offer-1",
        offer_version: 1,
        message:
          "I can offer €117.50 per chair with 20% deposit and delivery on 22 October.",
        purpose: "explanation",
        image_ids: [],
      },
    },
    {
      id: "message-5",
      role: "buyer",
      type: "accept",
      run: 1,
      at: "2026-10-10T09:04:00Z",
      data: { offer_id: "offer-1", image_ids: [] },
    },
  ];
  return room;
}
