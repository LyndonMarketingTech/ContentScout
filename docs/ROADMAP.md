# Enhancements, Correctness Fixes, API Integrations, and Development Prompts

## Purpose and priority

The audited application is a **static React research viewer**. It renders a TypeScript data file containing 156 manually compiled records and filters/ranks them in the browser. Its present scheduled refresh was an external managed-task instruction, not code in the repository. Therefore, true weekly refresh, source traceability, and metric accuracy need a server, a database, managed credentials, and a scheduler.

The recommended implementation order is intentionally conservative: establish **licensed, auditable data ingestion** before adding sophisticated rankings or AI analysis. Do not use brittle, unauthorised scraping as the production data source.

| Priority | Recommendation | Why it matters | Prerequisite |
|---:|---|---|---|
| P0 | Replace the static data file with a relational research database and source snapshots. | Makes results updateable, traceable, queryable, and reviewable. | PostgreSQL and backend API. |
| P0 | Add a scheduled ingestion pipeline with explicit platform adapters and run records. | Replaces the non-portable managed schedule with observable weekly operation. | Queue/scheduler, secrets manager, database. |
| P0 | Create an evidence/provenance model for every result. | Prevents unreliable rankings and provides a review path for research claims. | Database schema from `database/recommended`. |
| P0 | Implement connected-account and approved-provider authorization boundaries. | Official APIs do not generally grant unrestricted historical data for every public account. | OAuth/app approval and provider contracts. |
| P1 | Add a review queue, metric snapshot history, quality flags, and manual corrections. | Social metrics change; false positives and incomplete records require human quality control. | Authenticated internal-admin workflow. |
| P1 | Build export endpoints and asynchronous CSV/PDF generation. | Lets analysts reliably reuse a filtered report. | Backend query API and job storage. |
| P1 | Add full-text search plus saved filters and shareable report URLs. | Makes 20-per-month research quickly navigable. | Database search indexes and routing. |
| P2 | Add comparative trend, creator, hook, and format analysis. | Turns the list into actionable content intelligence. | Normalized data and historical metric snapshots. |
| P2 | Add AI-assisted classification and explanation with strict citations. | Speeds editorial analysis while preserving an auditable source trail. | Source evidence, model provider, review queue. |

---

## 1. Production data foundation

### Recommendation

Implement the recommended PostgreSQL schema in `database/recommended/001_research_dashboard_schema.postgres.sql`, and replace `client/src/data/posts.ts` at runtime with a backend `GET /api/posts` query. Retain the static file only as a demo seed/import source. Store each platform response (or a compliant normalized representation), capture time, raw-metric values, ranking score, and confidence/coverage flags.

**Critical correctness rule:** a value marked `organic` must be sourced from a provider field that actually excludes paid promotion. If a provider exposes only total/public metrics, label it `public_total` (or equivalent), not organic. Never calculate an engagement rate without a valid denominator and method definition.

### Development prompt

> You are a senior TypeScript backend and PostgreSQL engineer. Convert this static React tax-strategy research dashboard into a full-stack application. Use PostgreSQL and the supplied schema in `database/recommended/001_research_dashboard_schema.postgres.sql`. Implement typed REST endpoints for posts, filters, metric-history data, source evidence, and ingestion run status. Preserve the current dashboard's filters, collapsible cards, and ranking behavior. Replace the static TypeScript dataset with a read-only API query layer, but provide an idempotent importer for the existing static dataset. Add parameterized queries, pagination, validation, structured errors, migrations, unit tests, and a local Docker Compose development stack. Do not invent social metrics; preserve source provenance and distinguish public, organic, paid, estimated, and unavailable metrics.

---

## 2. Weekly refresh and durable automation

### Recommendation

Use a platform-native scheduler or a portable job runner—not an in-process timer inside a serverless API. Appropriate choices include:

| Deployment model | Recommended scheduler | Notes |
|---|---|---|
| Container/VPS | `cron` or a worker queue such as BullMQ + Redis | Good when you operate persistent workers. |
| AWS | EventBridge Scheduler + ECS/Fargate/Lambda + SQS | Durable retries and separate worker execution. |
| GCP | Cloud Scheduler + Cloud Run Jobs + Cloud SQL | Suitable for scheduled batch ingestion. |
| Vercel | Vercel Cron + external queue/database | Keep work within execution limits or dispatch it. |
| Render/Railway/Fly.io | Managed cron job + separate worker service | Confirm long-running job and secret support. |

Schedule a weekly intake plus a short reprocessing run 48 hours later for platforms whose insights may be delayed. Persist a lock/idempotency key for `platform + research_month + source_post_id + observed_at`, exponential retries, rate-limit backoff, and an alert on failure.

### Development prompt

> Design and implement a production-grade weekly social-research ingestion service for a React/TypeScript/PostgreSQL dashboard. It must run every Monday at 09:00 America/New_York and perform a second reconciliation pass 48 hours later. Implement a provider-adapter interface for Meta Facebook, Meta Instagram, YouTube, LinkedIn, and X. Each run must create an `ingestion_runs` record, rate-limit requests, use exponential backoff, be idempotent, record provider errors, store metric snapshots, and emit an alertable failure event. Use a queue-backed worker rather than an HTTP request or browser automation. Include Docker Compose for local development and deployment manifests/examples for one chosen cloud platform. Do not scrape pages in ways that violate provider terms; use connected accounts, approved API access, or a licensed provider.

---

## 3. Official-platform integration plan

The following reflects the official capability research recorded in `research/API_CAPABILITY_NOTES.md`. Confirm current API contracts and platform terms during implementation because platform versions, access tiers, metrics, and policies change.

### Meta: Facebook and Instagram

**Use case:** connected Facebook Pages and connected Instagram professional accounts owned/authorized by the organization; not unconstrained monitoring of arbitrary public accounts.

**Recommended design:**

1. Create a Meta app and implement OAuth for a permitted Page/professional Instagram account.
2. Store tokens encrypted at rest and rotate/refresh per the provider rules.
3. Pull post/media metadata incrementally and request only documented metrics.
4. Store post identity, post type, published time, canonical URL, raw response fingerprint, observed timestamp, and every metric snapshot.
5. Run reconciliation after the documented data-latency window. Handle Instagram album/carousel insight limitations transparently.
6. Ensure UI wording distinguishes public-facing metrics from provider-defined organic metrics.

**Configuration expected:** `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI`, `META_GRAPH_API_VERSION`, `META_WEBHOOK_VERIFY_TOKEN`, `META_WEBHOOK_APP_SECRET`, encrypted connected-account token storage.

### YouTube

**Use case:** public video/Short metadata and statistics for monitored channels; optional OAuth for private/authorized data.

**Recommended design:** use the YouTube Data API to fetch channel uploads/known video IDs and batch video `snippet`, `contentDetails`, `status`, and `statistics` fields. Cache data and track quota. Use `publishedAt`, not scrape-derived date fields. The public statistics fields are appropriate for total views/likes/comments, not necessarily organic-only performance.

**Configuration expected:** `YOUTUBE_API_KEY`; optionally `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` for OAuth-authorized workloads.

### LinkedIn

**Use case:** connected organization content, and only approved member/compliance scopes where explicitly granted.

**Constraint:** official retrieval and social-action access are permissioned; a general “top public LinkedIn posts from arbitrary personal creators” crawler is not a reliable or generally permitted direct API use case. Reach full coverage through organization connections, user-authorized access where approved, or a contractually licensed social listening/data provider.

**Recommended design:** make coverage explicit with `source_access_mode` (e.g., `connected_organization`, `authorized_member`, `licensed_provider`, `manual_verified`). Do not represent partial authorization as universe-wide rankings.

**Configuration expected:** `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI`, `LINKEDIN_API_VERSION`, and a token store. Provider-specific credentials only if a properly licensed vendor is selected.

### X

**Use case:** recent post discovery and public metrics, subject to the selected X product tier and policy.

**Constraint:** the current official recent-search endpoint limits `start_time` to the previous seven days. A January-2026 historical backfill cannot be recreated from a weekly-only endpoint after the fact; use a licensed historical/X data plan or start accumulating the archive prospectively. Current public metrics should be tracked as snapshots because they change over time.

**Recommended design:** ingest once weekly (or daily for accuracy), derive content format from post/media fields, retain post-level metrics and video media metrics separately, and document combined public vs owned-content organic metrics. Use saved account lists/queries to avoid broad noisy search.

**Configuration expected:** `X_BEARER_TOKEN`; optionally OAuth user-context variables for owned-account or approved workflows (`X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_REDIRECT_URI`).

### Development prompt

> Implement a compliant, modular social-platform adapter layer for Facebook, Instagram, YouTube, LinkedIn, and X. Each adapter must expose `discoverPosts`, `fetchPostDetails`, `fetchMetricSnapshot`, and `normalizePost`. Providers must report capability metadata: supported content types, metric availability, organic-vs-total status, earliest available history, and access mode. Implement adapters against official APIs where authorized and return a typed `unavailable`/`partial_coverage` state rather than fabricating fields. All tokens must remain server-side. Add tests using recorded sanitized API fixtures; no browser scraping or client-side secret use.

---

## 4. Ranking and research quality

### Recommendation

“Top 20 per month per platform” requires a defined cohort and a metric policy, or it can become an unsupported claim. Formalize these values:

| Concept | Recommended policy |
|---|---|
| Universe | Explicit monitored accounts, keywords, and/or licensed provider dataset—not “all public posts” unless coverage contractually supports it. |
| Time zone | Store UTC; report monthly filters in a configurable reporting time zone (default `America/New_York`). |
| Ranking time | Score on a consistent metric snapshot age (e.g., 14 days after publication) and display `observed_at`. |
| Engagement score | `likes + comments + shares + saves + reposts` only where fields exist. Do not coerce unavailable values to zero without an availability flag. |
| Engagement rate | Use `engagements / reach` where reach is available; else if defensible, `engagements / followers_at_publish`. Label denominator and method. |
| Cross-platform ranking | Normalize platform scores and present an `apples-to-oranges` warning. Prefer per-platform rankings. |
| AI explanation | Generate only from cited content/metrics, include a confidence flag, and route low-confidence analyses to review. |

### Development prompt

> Build a transparent social-post ranking engine. It should produce Top 20 results by month and platform while retaining all input metrics, metric availability states, ranking timestamp, reporting timezone, rank rationale, and evidence links. Support score modes: total interactions, engagement rate, views, likes, comments, recency, and editorial relevance. Require a stated denominator for rates. Avoid treating missing metrics as zero. Provide SQL views/materialized views plus tested TypeScript scoring functions. In the UI, show a tooltip explaining every ranking method and a visible coverage notice for partial-access platforms.

---

## 5. Research workflow and editorial governance

### Recommendation

Add a reviewer workflow before results become “published” in the dashboard. Draft results may be automatically collected and AI-enriched, but every high-impact claim should be backed by canonical content URL, retrieval time, source-access mode, and a metric snapshot. Track corrections instead of overwriting history.

Recommended roles: **Admin** (configuration and source connections), **Researcher** (curation/annotation), **Reviewer** (approval/corrections), and **Viewer** (read-only dashboard).

### Development prompt

> Add an internal research-review workflow to the dashboard. Collected posts begin as `draft`, then move through `needs_review`, `approved`, `rejected`, and `archived`. A reviewer must be able to inspect canonical links, raw-source references, metric snapshots, normalized fields, AI-generated hook/analysis, coverage flags, and change history. Support per-field edits with an audit log, approval notes, and role-based access control. Approved records alone should appear in the public/reporting view by default.

---

## 6. Dashboard improvements

### Recommended features

1. **Search and saved views.** Free-text search across page name, handle, hook, caption, and hashtags; persist filters in URLs.
2. **Exports.** Generate CSV and print-optimized PDF from the current filtered result set; include data-as-of timestamp and coverage caveat.
3. **Research detail page.** A route per post with source evidence, metric history chart, snapshots, and analyst annotations.
4. **Trend visuals.** Platform-native plots for monthly post volume, median engagement, and top content types; do not merge incomparable metrics by default.
5. **Account watchlists.** Manage monitored U.S.-based accounts and qualification evidence.
6. **Data quality panel.** Surface completeness, failed sources, restricted access, stale observations, and potential duplicate posts.
7. **Accessibility.** Ensure expandable cards use semantic buttons/ARIA state, keyboard focus, strong contrast, and reduced-motion support.

### Development prompt

> Extend the current dashboard into an accessible research application. Preserve its editorial visual language and collapsible result cards, but add URL-persisted filters, full-text search, server-side pagination, exportable CSV, a print-friendly report view, and an individual post detail page with metric-history chart and evidence timeline. Use semantic controls, WCAG 2.2 AA contrast, keyboard navigation, screen-reader labels, and reduced-motion handling. All exports must include filter parameters, coverage status, and data-as-of timestamps.

---

## 7. Security, privacy, compliance, and operations

### Required fixes

| Area | Requirement |
|---|---|
| Secrets | Never expose provider credentials in Vite `VITE_*` variables. Keep OAuth/API secrets in a server-side secrets manager. |
| Tokens | Encrypt stored tokens, restrict decryption to workers, implement refresh/revocation, and redact tokens from logs. |
| Data minimization | Store the fields required for research and permitted by the provider; define retention/deletion processes. |
| Webhooks | Verify signatures, apply replay protection, and enqueue work rather than processing synchronously. |
| Observability | Structured logs, metrics, tracing, run history, error alerts, and provider rate-limit telemetry. |
| Testing | Unit tests for normalization/ranking, API contract tests with fixtures, and end-to-end tests for filters/review/export. |
| Backups | Automated database backups, restore drills, and a documented recovery objective. |

### Development prompt

> Harden the social research dashboard for production. Add a server-side secrets abstraction, encrypted OAuth token storage, provider rate-limit handling, webhook verification, audit logging, structured telemetry, health checks, database backup guidance, and a test suite spanning unit, integration, contract-fixture, and browser tests. Ensure no social API secret reaches client bundles or logs. Provide a threat-model summary and incident-response runbook.

---

## 8. Explicit non-recommendations

* Do **not** claim exhaustive “top posts across all U.S.-based accounts” without a licensed data universe and a documented coverage methodology.
* Do **not** rely on arbitrary HTML scraping or headless logged-in browser sessions as the production data pipeline; the approach is fragile and can conflict with platform terms.
* Do **not** use an LLM to invent metrics, post captions, content links, rankings, or reasons for performance. Generated analysis must be grounded in stored source evidence.
* Do **not** put weekly refresh logic only in a static frontend or expect a deployed frontend to write its own dataset.
* Do **not** compare raw cross-platform likes/views as if the metrics share a common denominator.

## Acceptance criteria for a full-fidelity v2

1. A new social post from a connected/authorized source appears after the scheduled pipeline run, with source evidence and an observed timestamp.
2. Every displayed metric identifies availability and metric type (`public_total`, `organic`, `paid`, `estimated`, or `unavailable`).
3. Every Top 20 list identifies its universe, method, as-of time, and coverage state.
4. All filters work server-side over PostgreSQL and shareable URLs reproduce the same results.
5. A failed provider run is visible to administrators and does not silently make the dashboard look current.
6. A developer can run the application locally using `SETUP.md`, without any Manus runtime, managed token, or browser tool.
