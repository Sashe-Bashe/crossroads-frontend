"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  LayoutGrid,
  LoaderCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import {
  api,
  API_URL,
  cents,
  date,
  money,
  safeUrl,
  type Actor,
  type Approval,
  type Audit,
  type Listing,
  type Order,
  type Preview,
  type Quote,
  type RFQ,
} from "@/lib/api";

type Tab =
  | "Overview"
  | "Marketplace"
  | "Requests for quote"
  | "Approvals"
  | "Orders"
  | "Activity";
type Dialog =
  | { kind: "rfq"; listing: Listing }
  | { kind: "quote"; rfq: RFQ }
  | { kind: "preview"; preview: Preview }
  | { kind: "delivery"; order: Order }
  | { kind: "dispute"; order: Order };
const nav = [
  { name: "Overview", icon: LayoutGrid },
  { name: "Marketplace", icon: ShoppingBag },
  { name: "Requests for quote", icon: FileText },
  { name: "Approvals", icon: ShieldCheck },
  { name: "Orders", icon: Boxes },
  { name: "Activity", icon: Clock3 },
] as const;
const demos = [
  { label: "Human buyer / approver", token: "demo-buyer-token" },
  { label: "Human seller", token: "demo-seller-token" },
  { label: "Delegated buyer agent", token: "demo-agent-token" },
];
function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className={`badge ${String(children).toLowerCase().replaceAll(" ", "-")}`}
    >
      {children}
    </span>
  );
}
function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty">
      <ClipboardList size={30} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
function Snapshot({ preview: p }: { preview: Preview }) {
  return (
    <div className="snapshot">
      <p className="eyebrow">Exact transaction snapshot</p>
      <h3>{p.scope}</h3>
      <div className="detail-grid">
        <div>
          <small>Total · USD</small>
          <strong>{money(p.totalCents)}</strong>
        </div>
        <div>
          <small>Delivery commitment</small>
          <strong>{p.deliveryDays} days</strong>
        </div>
        <div>
          <small>Supplier</small>
          <span>{p.sellerId}</span>
        </div>
        <div>
          <small>Terms / quote version</small>
          <span>
            {p.termsVersion} / {p.quoteVersion}
          </span>
        </div>
        <div>
          <small>Expires</small>
          <span>
            {date(p.expiresAt)} · {new Date(p.expiresAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="criteria">
        <strong>Acceptance criteria</strong>
        <p>{p.acceptanceCriteria}</p>
        <strong>Delivery deadline</strong>
        <p>{new Date(p.deadline).toLocaleString()}</p>
        <strong>Transaction terms · {p.termsVersion}</strong>
        <p>{p.termsText}</p>
        <small>
          Demo fees: {money(p.feesCents)} · Demo taxes: {money(p.taxesCents)}
        </small>
      </div>
      <details>
        <summary>Snapshot evidence</summary>
        <code>{p.snapshotHash}</code>
        <small>
          Preview: {p.id} · Quote: {p.quoteId}
        </small>
      </details>
    </div>
  );
}
export default function Home() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [token, setToken] = useState("demo-buyer-token");
  const [custom, setCustom] = useState("demo-buyer-token");
  const [actor, setActor] = useState<Actor | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All services");
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [selected, setSelected] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteReload, setQuoteReload] = useState(0);
  const [sessionOpen, setSessionOpen] = useState(false);
  const generation = useRef(0);
  const quoteGeneration = useRef(0);
  const actionLock = useRef(false);
  const keys = useRef<Record<string, string>>({});
  const seller = actor?.role === "seller";
  const humanBuyer =
    !!actor &&
    actor.kind === "human" &&
    ["buyer", "approver", "owner", "admin"].includes(actor.role);
  const buyer = !!actor && !seller;
  const refresh = useCallback(async () => {
    const gen = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const me = await api<Actor>(token, "/me");
      const [ls, rs, os, as, events] = await Promise.all([
        api<Listing[]>(token, "/listings"),
        api<RFQ[]>(token, "/rfqs"),
        api<Order[]>(token, "/orders"),
        me.role === "seller"
          ? Promise.resolve([])
          : api<Approval[]>(token, "/approvals"),
        api<Audit[]>(token, "/audit"),
      ]);
      if (gen !== generation.current) return;
      setActor(me);
      setListings(ls);
      setRfqs(rs);
      setOrders(os);
      setApprovals(as);
      setAudit(events);
      setQuoteReload((value) => value + 1);
    } catch (e) {
      if (gen === generation.current) {
        setError((e as Error).message);
        setActor(null);
        setListings([]);
        setRfqs([]);
        setOrders([]);
        setApprovals([]);
        setAudit([]);
      }
    } finally {
      if (gen === generation.current) setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    void refresh();
    return () => {
      generation.current++;
    };
  }, [refresh]);
  useEffect(() => {
    const gen = ++quoteGeneration.current;
    setQuotes([]);
    if (!selected) {
      setQuoteLoading(false);
      return;
    }
    setQuoteLoading(true);
    api<Quote[]>(token, `/quotes?rfqId=${encodeURIComponent(selected)}`)
      .then((q) => {
        if (gen === quoteGeneration.current) setQuotes(q);
      })
      .catch((e) => {
        if (gen === quoteGeneration.current) setError(e.message);
      })
      .finally(() => {
        if (gen === quoteGeneration.current) setQuoteLoading(false);
      });
    return () => {
      quoteGeneration.current++;
    };
  }, [selected, token, quoteReload]);
  function switchToken(value: string) {
    if (busy || loading) return;
    generation.current++;
    quoteGeneration.current++;
    setActor(null);
    setListings([]);
    setRfqs([]);
    setOrders([]);
    setApprovals([]);
    setAudit([]);
    setQuotes([]);
    setSelected("");
    setDialog(null);
    setNotice("");
    setToken(value);
    setCustom(value);
    setSessionOpen(false);
  }
  async function act(work: () => Promise<void>, message: string) {
    if (actionLock.current) return;
    actionLock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await work();
      setNotice(message);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  }
  async function commit(a: Approval) {
    await act(async () => {
      const storageKey = `crossroads:order:${actor?.organizationId}:${a.previewId}`;
      let key = keys.current[storageKey];
      if (!key) {
        key = sessionStorage.getItem(storageKey) || crypto.randomUUID();
        sessionStorage.setItem(storageKey, key);
        keys.current[storageKey] = key;
      }
      await api<Order>(
        token,
        "/orders",
        { previewId: a.previewId, approvalId: a.id },
        key,
      );
      setTab("Orders");
    }, "Order committed. Your purchase is now tracked in Orders.");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) || "").trim();
    await act(async () => {
      if (!dialog) return;
      if (dialog.kind === "rfq") {
        const deadline = new Date(get("deadline"));
        if (deadline.getTime() <= Date.now())
          throw new Error("Choose a future deadline.");
        await api(token, "/rfqs", {
          listingId: dialog.listing.id,
          title: get("title"),
          description: get("description"),
          budgetCents: cents(get("amount")),
          deadline: deadline.toISOString(),
          acceptanceCriteria: get("criteria"),
        });
        setTab("Requests for quote");
      }
      if (dialog.kind === "quote") {
        const expires = new Date(get("expires"));
        if (expires.getTime() <= Date.now())
          throw new Error("Choose a future quote expiry.");
        await api(token, "/quotes", {
          rfqId: dialog.rfq.id,
          scope: get("scope"),
          totalCents: cents(get("amount")),
          deliveryDays: Number(get("days")),
          expiresAt: expires.toISOString(),
        });
        const q = await api<Quote[]>(
          token,
          `/quotes?rfqId=${encodeURIComponent(dialog.rfq.id)}`,
        );
        setQuotes(q);
        setSelected(dialog.rfq.id);
      }
      if (dialog.kind === "delivery") {
        if (!safeUrl(get("url")))
          throw new Error("Use a valid HTTPS delivery URL.");
        await api(
          token,
          `/orders/${encodeURIComponent(dialog.order.id)}/delivery`,
          { url: get("url"), notes: get("notes") },
        );
      }
      if (dialog.kind === "dispute")
        await api(
          token,
          `/orders/${encodeURIComponent(dialog.order.id)}/disputes`,
          { reason: get("reason") },
        );
      setDialog(null);
    }, "Saved successfully. Workspace updated.");
  }
  const pending = approvals.filter((a) => a.status === "pending");
  const filtered = listings.filter(
    (l) =>
      (category === "All services" || l.category === category) &&
      `${l.title} ${l.description} ${l.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const titles: Record<Tab, [string, string]> = {
    Overview: [
      "Good work starts here.",
      "Your procurement, from first request to final delivery.",
    ],
    Marketplace: [
      "Find your next specialist.",
      "Defined scopes. Transparent pricing. A better way to buy services.",
    ],
    "Requests for quote": [
      seller ? "Your next opportunity." : "From brief to best fit.",
      "Keep requirements clear and compare supplier commitments.",
    ],
    Approvals: [
      "Confidence before commitment.",
      "Review the exact scope, price, and terms before placing an order.",
    ],
    Orders: [
      "Every delivery, in view.",
      "Follow the work and keep fulfillment separate from payment.",
    ],
    Activity: [
      "A record of every step.",
      "Trace procurement actions across your organization.",
    ],
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Crossroads home">
          <span className="brand-mark">
            <ArrowUpRight />
            <ArrowDownLeft />
          </span>
          crossroads<span className="brand-dot">.</span>
        </a>
        <div className="workspace">
          <span className="avatar">C</span>
          <div>
            <strong>Crossroads workspace</strong>
            <small>Business procurement</small>
          </div>
          <span className="workspace-dot" />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          {nav.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              className={tab === name ? "nav-item active" : "nav-item"}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Approvals" && pending.length > 0 && (
                <b>{pending.length}</b>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="guard-card">
            <ShieldCheck size={22} />
            <strong>Human-led. Agent-ready.</strong>
            <p>Every purchase starts with a reviewable transaction.</p>
            <span>
              Built for accountable buying <ArrowUpRight size={13} />
            </span>
          </div>
          <button className="nav-item" onClick={() => setSessionOpen(true)}>
            <CircleHelp size={19} />
            Demo connection
          </button>
          <div className="profile">
            <span className="avatar small">
              {seller ? "S" : actor?.kind === "agent" ? "A" : "B"}
            </span>
            <div>
              <strong>
                {seller
                  ? "Seller workspace"
                  : actor?.kind === "agent"
                    ? "Delegated buyer"
                    : "Buyer workspace"}
              </strong>
              <small>Local demo session</small>
            </div>
            <button
              aria-label="Change demo identity"
              onClick={() => setSessionOpen(true)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <strong>{tab}</strong>
          </div>
          <div className="top-actions">
            <span className="demo-tag">
              <span />
              LOCAL DEMO
            </span>
            <button
              className="icon-button"
              title="Refresh workspace"
              aria-label="Refresh workspace"
              disabled={loading || busy}
              onClick={() => void refresh()}
            >
              <RefreshCw size={17} className={loading ? "spin" : ""} />
            </button>
            <button
              className="icon-button"
              aria-label="Open approvals"
              onClick={() => setTab("Approvals")}
            >
              <Bell size={18} />
            </button>
            <button
              className="avatar small"
              aria-label="Select demo identity"
              onClick={() => setSessionOpen(true)}
            >
              {seller ? "S" : "B"}
            </button>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                {seller ? "SUPPLIER DESK" : "PROCUREMENT, CONNECTED"}
              </p>
              <h1>{titles[tab][0]}</h1>
              <p>{titles[tab][1]}</p>
            </div>
            <button
              className="primary"
              disabled={!buyer || loading}
              onClick={() => setTab("Marketplace")}
            >
              <Plus size={17} />
              New request
            </button>
          </div>
          <div className="demo-banner">
            <Fingerprint size={17} />
            <span>
              <strong>Demo environment</strong> ·{" "}
              {actor ? `${actor.kind} / ${actor.role}` : "Not connected"} · Test
              credentials only. No real authentication or payments.
            </span>
            <button
              disabled={busy || loading}
              onClick={() => setSessionOpen(true)}
            >
              Switch identity <ArrowRight size={14} />
            </button>
          </div>
          {error && (
            <div className="alert error" role="alert">
              <strong>Something needs attention</strong>
              <span>{error}</span>
              <button onClick={() => void refresh()} disabled={loading || busy}>
                Retry connection
              </button>
            </div>
          )}
          {notice && (
            <div className="alert success" role="status">
              <CheckCheck size={19} />
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {loading && (
            <div className="loading" role="status">
              <LoaderCircle size={17} className="spin" />
              Syncing workspace…
            </div>
          )}
          {tab === "Overview" && (
            <>
              <div className="stats">
                <Stat
                  label="Open requests"
                  value={rfqs.filter((r) => r.status === "open").length}
                  detail="Ready for supplier responses"
                  icon={<FileText />}
                />
                <Stat
                  label="Awaiting approval"
                  value={pending.length}
                  detail="A human decision comes next"
                  icon={<ShieldCheck />}
                />
                <Stat
                  label="Orders tracked"
                  value={orders.length}
                  detail="From commitment to delivery"
                  icon={<Boxes />}
                />
                <Stat
                  label="Order value · USD"
                  value={money(orders.reduce((n, o) => n + o.totalCents, 0))}
                  detail="Total value of visible orders"
                  icon={<ArrowUpRight />}
                />
              </div>
              <div className="overview-grid">
                <section className="hero-card">
                  <div>
                    <span className="pill">
                      <Sparkles size={13} />A better way to get work done
                    </span>
                    <h2>
                      Great suppliers.
                      <br />
                      Clear commitments.
                    </h2>
                    <p>
                      Turn your next business need into a well-scoped,
                      human-approved purchase.
                    </p>
                    <button onClick={() => setTab("Marketplace")}>
                      Explore the marketplace <ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="hero-art" aria-hidden="true">
                    <div className="orbit one" />
                    <div className="orbit two" />
                    <div className="art-tile tile-back">
                      <FileCheck2 size={44} />
                    </div>
                    <div className="art-tile tile-front">
                      <CheckCheck size={48} />
                    </div>
                    <span className="art-spark">✦</span>
                  </div>
                  <div className="hero-footer">
                    <span>
                      <Check size={14} />
                      Structured quotes
                    </span>
                    <span>
                      <Check size={14} />
                      Human approvals
                    </span>
                    <span>
                      <Check size={14} />
                      Traceable orders
                    </span>
                  </div>
                </section>
                <section className="panel next-steps">
                  <p className="eyebrow">YOUR NEXT MOVE</p>
                  <h2>A clear path to delivery</h2>
                  {[
                    {
                      title: "Define the work",
                      sub: "Choose a service and send your brief.",
                      target: "Marketplace",
                    },
                    {
                      title: "Review & approve",
                      sub: `${pending.length} purchase${pending.length === 1 ? "" : "s"} waiting for review.`,
                      target: "Approvals",
                    },
                    {
                      title: "Track the outcome",
                      sub: "Review deliveries and accept the work.",
                      target: "Orders",
                    },
                  ].map((step, i) => (
                    <button
                      key={step.title}
                      onClick={() => setTab(step.target as Tab)}
                    >
                      <span className="step-number">0{i + 1}</span>
                      <span>
                        <strong>{step.title}</strong>
                        <small>{step.sub}</small>
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </section>
              </div>
              <div className="section-heading">
                <div>
                  <h2>Discover services</h2>
                  <p>Specialist services for your next business milestone.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setTab("Marketplace")}
                >
                  View marketplace <ArrowRight size={16} />
                </button>
              </div>
              {catalog(listings.slice(0, 3))}
              <section className="panel recent">
                <div className="section-heading">
                  <h2>Recent orders</h2>
                  <button
                    className="text-button"
                    onClick={() => setTab("Orders")}
                  >
                    View all <ArrowRight size={15} />
                  </button>
                </div>
                {orders.length ? (
                  orders.slice(0, 3).map((o) => (
                    <button
                      className="order-row"
                      key={o.id}
                      onClick={() => setTab("Orders")}
                    >
                      <span className="service-icon">
                        <Boxes size={19} />
                      </span>
                      <span>
                        <strong>{o.scope}</strong>
                        <small>
                          {date(o.createdAt)} · {o.id}
                        </small>
                      </span>
                      <Badge>{o.status}</Badge>
                      <strong>{money(o.totalCents)}</strong>
                      <ChevronRight size={16} />
                    </button>
                  ))
                ) : (
                  <Empty title="Your first order starts with a brief">
                    Explore a service, request a quote, and review the details
                    together.
                  </Empty>
                )}
              </section>
            </>
          )}
          {tab === "Marketplace" && (
            <>
              <div className="filterbar">
                <label className="search">
                  <Search size={18} />
                  <input
                    aria-label="Search services"
                    placeholder="Search services, expertise, or keywords"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Service category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {[
                    "All services",
                    ...new Set(listings.map((l) => l.category)),
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <span>{filtered.length} services</span>
              </div>
              {catalog(filtered)}
            </>
          )}
          {tab === "Requests for quote" && (
            <div className="rfq-layout">
              <section className="panel">
                <div className="section-heading">
                  <h2>{seller ? "RFQ inbox" : "Your requests"}</h2>
                  <Badge>{rfqs.length}</Badge>
                </div>
                {!rfqs.length && (
                  <Empty title="No requests yet">
                    {seller
                      ? "Buyer requests will appear here when shared by the API."
                      : "Choose a marketplace service to create your first brief."}
                  </Empty>
                )}
                {rfqs.map((r) => (
                  <button
                    className={`rfq-row ${selected === r.id ? "selected" : ""}`}
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                  >
                    <div>
                      <Badge>{r.status}</Badge>
                      <small>{date(r.createdAt)}</small>
                    </div>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                    <div>
                      <strong>{money(r.budgetCents)}</strong>
                      <span>Due {date(r.deadline)}</span>
                    </div>
                  </button>
                ))}
              </section>
              <section className="panel quote-panel">
                {selected ? (
                  (() => {
                    const r = rfqs.find((x) => x.id === selected);
                    return (
                      r && (
                        <>
                          <div className="section-heading">
                            <div>
                              <p className="eyebrow">REQUEST DETAILS</p>
                              <h2>{r.title}</h2>
                            </div>
                            {seller && r.status === "open" && (
                              <button
                                className="primary"
                                disabled={busy}
                                onClick={() =>
                                  setDialog({ kind: "quote", rfq: r })
                                }
                              >
                                <Plus size={16} />
                                Submit quote
                              </button>
                            )}
                          </div>
                          <p>{r.description}</p>
                          <div className="criteria">
                            <strong>Acceptance criteria</strong>
                            <p>{r.acceptanceCriteria}</p>
                          </div>
                          <h3>Supplier quotes</h3>
                          {quoteLoading ? (
                            <p role="status">Loading quotes…</p>
                          ) : !quotes.length ? (
                            <Empty title="Waiting on a proposal">
                              Supplier quotes will appear here with a clear
                              scope and total.
                            </Empty>
                          ) : (
                            quotes.map((q) => (
                              <article className="quote-card" key={q.id}>
                                <div className="section-heading">
                                  <strong>{money(q.totalCents)}</strong>
                                  <Badge>{q.status}</Badge>
                                </div>
                                <p>{q.scope}</p>
                                <div className="quote-meta">
                                  <span>Supplier: {q.sellerId}</span>
                                  <span>{q.deliveryDays} day delivery</span>
                                  <span>Expires {date(q.expiresAt)}</span>
                                  <span>
                                    Terms {q.termsVersion} · v{q.version}
                                  </span>
                                </div>
                                {buyer && q.status === "offered" && (
                                  <button
                                    className="primary"
                                    disabled={
                                      busy ||
                                      new Date(q.expiresAt).getTime() <=
                                        Date.now()
                                    }
                                    onClick={() =>
                                      void act(async () => {
                                        const p = await api<Preview>(
                                          token,
                                          "/order-previews",
                                          { quoteId: q.id },
                                        );
                                        setDialog({
                                          kind: "preview",
                                          preview: p,
                                        });
                                      }, "Order preview ready for review.")
                                    }
                                  >
                                    Review order preview{" "}
                                    <ArrowRight size={16} />
                                  </button>
                                )}
                              </article>
                            ))
                          )}
                        </>
                      )
                    );
                  })()
                ) : (
                  <Empty title="Select a request">
                    Review requirements and compare quotes side by side.
                  </Empty>
                )}
              </section>
            </div>
          )}
          {tab === "Approvals" && (
            <>
              <div className="info-strip">
                <ShieldCheck size={20} />
                <p>
                  Approval is bound to an exact transaction snapshot.{" "}
                  {humanBuyer
                    ? "Review the details, approve, then commit the order."
                    : "A human buyer must approve. Delegated agents can request approval and commit approved orders."}
                </p>
              </div>
              {!approvals.length ? (
                <Empty title="All clear. No approvals to review.">
                  Prepare an order preview from a supplier quote to request
                  approval.
                </Empty>
              ) : (
                <div className="approval-grid">
                  {approvals.map((a) => (
                    <article className="panel approval-card" key={a.id}>
                      <div className="section-heading">
                        <h3>Purchase review</h3>
                        <Badge>{a.status}</Badge>
                      </div>
                      {a.preview ? (
                        <Snapshot preview={a.preview} />
                      ) : (
                        <p>
                          Snapshot unavailable. Refresh or ask the API operator
                          to include the preview before review.
                        </p>
                      )}
                      <details>
                        <summary>Approval evidence</summary>
                        <code>{a.payloadHash}</code>
                        <small>{a.id}</small>
                      </details>
                      <div className="card-actions">
                        {a.status === "pending" && humanBuyer && (
                          <button
                            className="primary"
                            disabled={
                              busy ||
                              !a.preview ||
                              new Date(a.preview.expiresAt).getTime() <=
                                Date.now()
                            }
                            onClick={() =>
                              void act(async () => {
                                await api(
                                  token,
                                  `/approvals/${encodeURIComponent(a.id)}/approve`,
                                  {},
                                );
                              }, "Snapshot approved. You can now commit this order.")
                            }
                          >
                            <ShieldCheck size={16} />
                            Approve snapshot
                          </button>
                        )}
                        {a.status === "approved" && buyer && (
                          <button
                            className="primary"
                            disabled={
                              busy ||
                              !a.preview ||
                              new Date(a.preview.expiresAt).getTime() <=
                                Date.now()
                            }
                            onClick={() => void commit(a)}
                          >
                            Commit order <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
          {tab === "Orders" &&
            (!orders.length ? (
              <Empty title="No orders yet">
                Approved purchases appear here with fulfillment and payment
                status.
              </Empty>
            ) : (
              <div className="orders-grid">
                {orders.map((o) => (
                  <article className="panel order-card" key={o.id}>
                    <div className="section-heading">
                      <span className="service-icon">
                        <PackageCheck size={22} />
                      </span>
                      <Badge>{o.status}</Badge>
                    </div>
                    <h2>{o.scope}</h2>
                    <small className="muted">
                      {o.id} · {date(o.createdAt)}
                    </small>
                    <div className="order-total">
                      <strong>{money(o.totalCents)}</strong>
                      <span>
                        Payment <Badge>{o.paymentStatus}</Badge>
                      </span>
                    </div>
                    <div className="quote-meta">
                      <span>Buyer: {o.buyerId}</span>
                      <span>Supplier: {o.sellerId}</span>
                    </div>
                    {o.deliveryUrl && (
                      <div className="criteria">
                        <strong>Delivery submitted</strong>
                        <p>
                          {o.deliveryNotes || "No delivery notes provided."}
                        </p>
                        {safeUrl(o.deliveryUrl) ? (
                          <a
                            className="text-button"
                            href={safeUrl(o.deliveryUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open deliverable <ArrowUpRight size={15} />
                          </a>
                        ) : (
                          <p>Unsupported delivery URL.</p>
                        )}
                      </div>
                    )}
                    <>
                      {o.disputes?.map((d) => (
                        <div className="criteria" key={d.id}>
                          <strong>Open dispute · {date(d.createdAt)}</strong>
                          <p>{d.reason}</p>
                        </div>
                      ))}
                    </>
                    <div className="card-actions">
                      {seller && o.status === "placed" && (
                        <button
                          className="primary"
                          disabled={busy}
                          onClick={() =>
                            setDialog({ kind: "delivery", order: o })
                          }
                        >
                          Submit delivery
                        </button>
                      )}
                      {humanBuyer && o.status === "delivered" && (
                        <button
                          className="primary"
                          disabled={busy}
                          onClick={() =>
                            void act(async () => {
                              await api(
                                token,
                                `/orders/${encodeURIComponent(o.id)}/accept`,
                                {},
                              );
                            }, "Delivery accepted.")
                          }
                        >
                          <Check size={16} />
                          Accept delivery
                        </button>
                      )}
                      {buyer &&
                        !["disputed", "cancelled"].includes(o.status) && (
                          <button
                            className="secondary"
                            disabled={busy}
                            onClick={() =>
                              setDialog({ kind: "dispute", order: o })
                            }
                          >
                            Open dispute
                          </button>
                        )}
                      <button
                        className="text-button"
                        disabled={busy}
                        onClick={() =>
                          void act(async () => {
                            const fresh = await api<Order>(
                              token,
                              `/orders/${encodeURIComponent(o.id)}`,
                            );
                            setOrders((prev) =>
                              prev.map((x) => (x.id === fresh.id ? fresh : x)),
                            );
                          }, "Order status refreshed.")
                        }
                      >
                        Refresh status
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          {tab === "Activity" && (
            <section className="panel">
              <div className="section-heading">
                <h2>Organization audit trail</h2>
                <Badge>{audit.length} events</Badge>
              </div>
              {!audit.length ? (
                <Empty title="The story starts here">
                  Procurement actions recorded by the API will appear in this
                  timeline.
                </Empty>
              ) : (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Resource</th>
                        <th>Organization</th>
                        <th>Recorded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...audit]
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map((e) => (
                          <tr key={e.id}>
                            <td>
                              <span className="event-dot" />
                              {e.action}
                            </td>
                            <td>{e.actorId}</td>
                            <td>{e.resourceId}</td>
                            <td>{e.organizationId}</td>
                            <td>{new Date(e.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
          <footer>
            <span>
              <span className={`connection-dot ${actor ? "online" : ""}`} />
              {actor ? "Connected to demo API" : "Awaiting API connection"}
            </span>
            <span>Crossroads · Better business, together.</span>
            <span>USD · Digital services</span>
          </footer>
        </main>
      </div>
      {sessionOpen && (
        <Modal
          title="Local demo connection"
          onClose={() => setSessionOpen(false)}
          busy={busy}
        >
          <p>
            These public demo tokens select a test identity. They are not
            production authentication. Tokens stay in memory and reset on
            reload.
          </p>
          <label>
            Demo identity
            <select
              disabled={busy || loading}
              value={demos.some((d) => d.token === token) ? token : ""}
              onChange={(e) => switchToken(e.target.value)}
            >
              {!demos.some((d) => d.token === token) && (
                <option value="">Custom demo token</option>
              )}
              {demos.map((d) => (
                <option value={d.token} key={d.token}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              switchToken(custom.trim());
            }}
          >
            <label>
              Custom demo bearer token
              <input
                required
                type="password"
                autoComplete="off"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </label>
            <button
              className="primary"
              disabled={busy || loading || !custom.trim()}
            >
              Connect demo identity
            </button>
          </form>
          <div className="criteria">
            <small>API endpoint</small>
            <code>{API_URL}</code>
            <p>
              Set NEXT_PUBLIC_API_URL in .env.local and restart to change the
              endpoint.
            </p>
          </div>
        </Modal>
      )}
      {dialog && (
        <Modal
          title={
            {
              rfq: "Create a request for quote",
              quote: "Submit a supplier quote",
              preview: "Review your order preview",
              delivery: "Submit the deliverable",
              dispute: "Open a dispute",
            }[dialog.kind]
          }
          onClose={() => setDialog(null)}
          busy={busy}
        >
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}
          {dialog.kind === "preview" ? (
            <>
              <Snapshot preview={dialog.preview} />
              <p className="muted">
                Requesting approval does not place an order. A human reviews
                this snapshot before commitment.
              </p>
              <button
                className="primary"
                disabled={
                  busy ||
                  new Date(dialog.preview.expiresAt).getTime() <= Date.now()
                }
                onClick={() =>
                  void act(async () => {
                    await api(token, "/approvals", {
                      previewId: dialog.preview.id,
                    });
                    setDialog(null);
                    setTab("Approvals");
                  }, "Approval requested. A human can now review this purchase.")
                }
              >
                <ShieldCheck size={17} />
                Request human approval
              </button>
            </>
          ) : (
            <form onSubmit={submit}>
              <fieldset disabled={busy}>
                {dialog.kind === "rfq" && (
                  <>
                    <p className="form-context">
                      Service: <strong>{dialog.listing.title}</strong>
                    </p>
                    <Field
                      label="Request title"
                      name="title"
                      defaultValue={dialog.listing.title}
                    />
                    <Field
                      label="Scope and requirements"
                      name="description"
                      area
                      placeholder="Describe the inputs, expected output, and project context."
                    />
                    <div className="form-grid">
                      <Field
                        label="Budget (USD)"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={(dialog.listing.priceCents / 100).toFixed(
                          2,
                        )}
                      />
                      <Field
                        label="Deadline"
                        name="deadline"
                        type="datetime-local"
                      />
                    </div>
                    <Field
                      label="Acceptance criteria"
                      name="criteria"
                      area
                      placeholder="What measurable checks must the delivery pass?"
                    />
                  </>
                )}
                {dialog.kind === "quote" && (
                  <>
                    <p className="form-context">
                      Quoting: <strong>{dialog.rfq.title}</strong>
                    </p>
                    <Field label="Scope and deliverables" name="scope" area />
                    <div className="form-grid">
                      <Field
                        label="Total (USD)"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                      />
                      <Field
                        label="Delivery days"
                        name="days"
                        type="number"
                        min="1"
                        step="1"
                      />
                    </div>
                    <Field
                      label="Quote expires"
                      name="expires"
                      type="datetime-local"
                    />
                    <p className="muted">
                      The API assigns the quote and terms versions.
                    </p>
                  </>
                )}
                {dialog.kind === "delivery" && (
                  <>
                    <Field
                      label="Deliverable URL"
                      name="url"
                      type="url"
                      placeholder="https://…"
                    />
                    <Field
                      label="Delivery notes"
                      name="notes"
                      area
                      placeholder="Explain the deliverable and how to verify acceptance criteria."
                    />
                  </>
                )}
                {dialog.kind === "dispute" && (
                  <>
                    <p>
                      Describe the issue so it can be recorded against this
                      order.
                    </p>
                    <Field label="Reason for dispute" name="reason" area />
                  </>
                )}
                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setDialog(null)}
                  >
                    Cancel
                  </button>
                  <button className="primary" type="submit">
                    {busy ? (
                      <>
                        <LoaderCircle size={16} className="spin" />
                        Saving…
                      </>
                    ) : dialog.kind === "rfq" ? (
                      "Send request"
                    ) : dialog.kind === "quote" ? (
                      "Submit quote"
                    ) : dialog.kind === "delivery" ? (
                      "Submit delivery"
                    ) : (
                      "Open dispute"
                    )}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
  function catalog(items: Listing[]) {
    return items.length ? (
      <div className="catalog-grid">
        {items.map((l, i) => (
          <article key={l.id} className="listing-card">
            <div className={`listing-art tone-${i % 3}`}>
              <div className="art-grid" />
              <span className="listing-glyph">
                {i % 3 === 0 ? (
                  <Boxes size={42} />
                ) : i % 3 === 1 ? (
                  <FileCheck2 size={42} />
                ) : (
                  <LayoutGrid size={42} />
                )}
              </span>
              <span className="category-tag">{l.category}</span>
            </div>
            <div className="listing-body">
              <div className="supplier">
                <span>{l.sellerId}</span>
                {l.verified && (
                  <span title="Simulated demo verification; no real business check performed">
                    <ShieldCheck size={13} />
                    Demo identity check
                  </span>
                )}
              </div>
              <h3>{l.title}</h3>
              <p>{l.description}</p>
              <div className="listing-bottom">
                <div>
                  <small>Starting at</small>
                  <strong>
                    {money(l.priceCents)}
                    <span> / service</span>
                  </strong>
                </div>
                <span>
                  <Clock3 size={13} />
                  {l.deliveryDays} days
                </span>
              </div>
              <button
                className="listing-cta"
                disabled={!buyer || busy || loading}
                onClick={() => setDialog({ kind: "rfq", listing: l })}
              >
                Request a quote <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <Empty
        title={
          loading
            ? "Loading services…"
            : error
              ? "Connect to discover services"
              : "No services found"
        }
      >
        {error
          ? "Start the demo backend, then refresh the workspace."
          : "Try another search or check back when suppliers publish services."}
      </Empty>
    );
  }
}
function Stat({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <section className="stat">
      <div>
        <span>{label}</span>
        {icon}
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </section>
  );
}
function Field({
  label,
  area,
  ...props
}: {
  label: string;
  area?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label>
      {label}
      {area ? (
        <textarea
          name={props.name}
          required
          rows={4}
          placeholder={props.placeholder}
        />
      ) : (
        <input required {...props} />
      )}
    </label>
  );
}
function Modal({
  title,
  children,
  onClose,
  busy,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="modal-header">
        <h2 id="dialog-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          disabled={busy}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
