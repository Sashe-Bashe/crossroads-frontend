"use client";

import { Check, CircleHelp, LockKeyhole, ShieldAlert } from "lucide-react";
import { human, money, type Offer, type Room } from "@/lib/api";

type Brief = NonNullable<Room["private_brief"]>;
type Requirement = Brief["requirements"][number];
type SharedBrief = Room["shared_briefs"][number];

const fieldLabels: Record<string, string> = {
  quantity: "Quantity",
  material: "Material",
  stackable: "Stackable",
  destination: "Destination",
  delivery_date: "Delivery date",
  latest_delivery: "Latest delivery",
  total: "Total including delivery",
  deposit_percent: "Deposit",
  unit_price: "Unit price",
  unsupported: "Additional need",
};
const statuses = {
  met: "Met",
  unmet: "Not met",
  unverified: "Unverified",
  waived: "Waived by owner",
};

function valueLabel(field: string, value: unknown) {
  if (value === null || value === undefined) return "Not specified";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    if (["total", "unit_price"].includes(field)) return money(value);
    if (field === "deposit_percent") return `${value}%`;
  }
  return String(value);
}

function Requirements({
  requirements,
  showVisibility = false,
}: {
  requirements: Requirement[];
  showVisibility?: boolean;
}) {
  return (
    <ul className="needs-list">
      {requirements.map((need) => (
        <li key={need.id} className={`need need-${need.status}`}>
          <div className="need-heading">
            <strong>{need.label}</strong>
            <span className={`need-status need-status-${need.status}`}>
              {need.status === "met" ? (
                <Check size={14} />
              ) : need.blocks_agreement ? (
                <ShieldAlert size={14} />
              ) : (
                <CircleHelp size={14} />
              )}
              {statuses[need.status]}
            </span>
          </div>
          <div className="need-meta">
            <span>{need.kind === "hard" ? "Must have" : "Preference"}</span>
            {showVisibility && (
              <span>{need.shareable ? "Shared" : "Private"}</span>
            )}
            {need.blocks_agreement && <span>Blocks agreement</span>}
          </div>
          {need.field !== "unsupported" && (
            <p>
              {fieldLabels[need.field] || human(need.field)} ·{" "}
              {
                { eq: "exactly", lte: "at most", gte: "at least" }[
                  need.operator
                ]
              }{" "}
              {valueLabel(need.field, need.value)}
            </p>
          )}
          {need.field === "unsupported" && (
            <p>
              This need is not supported by confirmed product or offer terms.
            </p>
          )}
          {need.resolution_note && (
            <p className="need-owner-note">
              Owner decision: {need.resolution_note}
            </p>
          )}
          {need.evidence.length > 0 && (
            <div
              className="need-evidence"
              aria-label={`Evidence for ${need.label}`}
            >
              {need.evidence.map((evidence, index) => {
                const field = evidence.path.split(".").at(-1) || evidence.path;
                return (
                  <span key={`${evidence.source}:${evidence.path}:${index}`}>
                    {human(evidence.source)} ·{" "}
                    {fieldLabels[field] || human(field)}:{" "}
                    {valueLabel(field, evidence.value)}
                  </span>
                );
              })}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function SharedNeeds({ briefs }: { briefs: SharedBrief[] }) {
  const published = briefs.filter(
    (brief) => brief.shareable_needs || brief.requirements.length > 0,
  );
  if (!published.length) return null;
  return (
    <details className="shared-needs">
      <summary>Needs shared with both businesses</summary>
      {published.map((brief) => (
        <section key={brief.role} aria-label={`${brief.role} shared needs`}>
          <h4>
            {human(brief.role)} · brief v{brief.version}
          </h4>
          {brief.shareable_needs && (
            <p className="conversation-text">{brief.shareable_needs}</p>
          )}
          <Requirements requirements={brief.requirements} />
        </section>
      ))}
    </details>
  );
}

export function PrivateBrief({ room }: { room: Room }) {
  const brief = room.private_brief;
  return (
    <section
      className="private-brief"
      aria-label="Your private negotiation brief"
    >
      <div className="guidance-private">
        <LockKeyhole size={14} /> Your workspace only
      </div>
      <h3>Your goals and needs</h3>
      {brief ? (
        <>
          <p className="muted">
            Current brief v{brief.version}. Shared needs are marked below.
          </p>
          {brief.goals && <p className="conversation-text">{brief.goals}</p>}
          {brief.shareable_needs && (
            <div className="brief-shared-excerpt">
              <strong>What your owner has shared</strong>
              <p className="conversation-text">{brief.shareable_needs}</p>
            </div>
          )}
          <Requirements requirements={brief.requirements} showVisibility />
          {!brief.goals &&
            !brief.shareable_needs &&
            !brief.requirements.length && (
              <p>No additional goals or needs have been recorded.</p>
            )}
        </>
      ) : (
        <p>No additional goals or needs have been recorded.</p>
      )}
      {room.requirement_blockers.length > 0 && (
        <div className="needs-blockers" role="status">
          <strong>Your needs must be resolved before agreement</strong>
          <ul>
            {room.requirement_blockers.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      <small>
        Your workspace owner can update the brief and sharing choices through
        the CLI.
      </small>
    </section>
  );
}

export function OfferNeedsReview({ offer }: { offer: Offer }) {
  const brief = offer.private_brief_review;
  const shared = offer.shared_brief_review || [];
  return (
    <details className="offer-needs-review">
      <summary>Needs reviewed with offer v{offer.version}</summary>
      <p className="muted">
        This review was recorded with this exact offer. Later brief changes
        require a new offer.
      </p>
      {brief ? (
        <section aria-label="Your needs recorded with this offer">
          <h4>Your private brief v{brief.version}</h4>
          {brief.goals && <p className="conversation-text">{brief.goals}</p>}
          <Requirements requirements={brief.requirements} showVisibility />
          {!brief.requirements.length && (
            <p>No additional requirements were recorded.</p>
          )}
        </section>
      ) : (
        <p>No private needs review was recorded for this older offer.</p>
      )}
      <SharedNeeds briefs={shared} />
    </details>
  );
}
