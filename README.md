# Top 20 Tax Strategy Social Media Posts

A static React research dashboard for reviewing and filtering tax-strategy social-media posts across Instagram, Facebook, YouTube, LinkedIn, and X.

This repository reproduces the current static dashboard only. It does not require a database, an application API, authentication, or external platform credentials. The post dataset is stored in `client/src/data/posts.ts`.

## What is included

- React 19 + TypeScript frontend
- Vite 7 development and build tooling
- Tailwind CSS 4 styling
- Wouter routing
- Radix/shadcn-style UI primitives
- Lucide icons
- Optional Express server for serving the production build
- Static research data in `client/src/data/posts.ts`
- The existing `patches/wouter@3.7.1.patch` pnpm patch

## What is not included

This migration intentionally does **not** implement a database, backend research API, automated weekly ingestion, authentication, or live social-platform integrations. Those ideas are future work only and are preserved, unchanged, in `docs/ROADMAP.md`.

The current dashboard works entirely from its in-repository TypeScript dataset.

## Requirements

Install the following on your computer:

1. **Node.js 22 LTS or newer**
2. **Git** (recommended)
3. **Corepack**, which is included with supported Node.js installations and is used to provide pnpm

No database, Docker installation, cloud account, or secret keys are required for the current dashboard.

## Clone the repository

After you create or upload this project to GitHub, open a terminal and run:

```bash
git clone YOUR_REPOSITORY_URL
cd tax-strategy-posts
```

Replace `YOUR_REPOSITORY_URL` with the HTTPS or SSH URL shown on your GitHub repository page. If your repository folder has a different name, use that name in the `cd` command.

## Install dependencies

Enable Corepack:

```bash
corepack enable
```

Then install the exact dependency versions recorded in the lockfile:

```bash
pnpm install --frozen-lockfile
```

Use `--frozen-lockfile` for normal setup so pnpm does not silently change dependency versions.

## Run the dashboard locally

Start the Vite development server:

```bash
pnpm dev
```

Open the URL printed in the terminal. It will normally be:

```text
http://localhost:3000
```

If port 3000 is already being used, Vite may select the next available port and print that address instead.

## Verify the project

Run TypeScript validation:

```bash
pnpm check
```

Create a production build:

```bash
pnpm build
```

The frontend production files are written to:

```text
dist/public
```

## Test the production server locally

After `pnpm build`, start the included Express server:

### macOS or Linux

```bash
NODE_ENV=production PORT=3000 pnpm start
```

### Windows PowerShell

```powershell
$env:NODE_ENV="production"
$env:PORT="3000"
pnpm start
```

Then visit:

```text
http://localhost:3000
```

Verify both of these paths:

- `/` — the research dashboard
- `/404` — the application's not-found screen

The Express server provides SPA fallback behavior, so frontend routes are served through `index.html`.

## Optional environment file

The dashboard does not require an `.env` file.

If you want to set the production server port, copy `.env.example` to `.env` and change `PORT`. Note that the current npm start script reads environment variables provided by your shell or hosting platform; it does not automatically load `.env` files by itself.

Example:

```text
PORT=3000
```

Analytics is intentionally disabled in `client/index.html`. If you add a real analytics provider later, add its public browser configuration intentionally and never place private API secrets in frontend variables or HTML.

## Deployment

You have two simple deployment choices.

### Option 1: Node-compatible host

Use this option on a host that can run Node.js processes.

Build command:

```bash
pnpm install --frozen-lockfile && pnpm build
```

Start command:

```bash
pnpm start
```

The hosting platform should provide `NODE_ENV=production` and may provide its own `PORT` value. The included Express server will serve the files from `dist/public`.

### Option 2: Static host

The dashboard does not need the Express server to function. On a static host, publish:

```text
dist/public
```

Configure the host so unknown frontend routes fall back to:

```text
/index.html
```

This is commonly called an **SPA fallback**, **rewrite**, or **history fallback**.

Examples of hosts that can serve the static output include Cloudflare Pages, Netlify, Vercel static deployments, and S3/CloudFront. Follow the selected host's instructions for configuring the SPA fallback.

## Updating the research posts

All current research records are stored in:

```text
client/src/data/posts.ts
```

There is no database or automatic weekly refresh in this version. Changing the research dataset currently means editing that TypeScript file and rebuilding/redeploying the site.

## Future roadmap

`docs/ROADMAP.md` contains the supplied future-development plan for database-backed research, scheduled ingestion, platform APIs, provenance, ranking improvements, review workflows, exports, and related production capabilities.

**None of those roadmap items are implemented as part of this migration.** They are documentation for potential future development only.

## Project structure

```text
.
├── client/
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── data/
│       │   └── posts.ts
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
├── docs/
│   └── ROADMAP.md
├── patches/
│   └── wouter@3.7.1.patch
├── server/
│   └── index.ts
├── shared/
├── .env.example
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the local Vite development server |
| `pnpm check` | Run TypeScript validation |
| `pnpm build` | Build the frontend and Express server |
| `pnpm start` | Start the already-built production Express server |
| `pnpm preview` | Preview the Vite frontend build |
| `pnpm format` | Format files with Prettier |

## Troubleshooting

### `pnpm` is not recognized

Run:

```bash
corepack enable
```

Then try the pnpm command again.

### Port 3000 is already in use

For local development, Vite will normally move to the next available port and print the new URL.

For the production Express server, set a different `PORT` value on your host or in your terminal.

### A GitHub deployment opens a 404 on a direct route

Your static hosting service probably needs an SPA fallback. Configure unknown paths to serve `index.html`.

### `pnpm install --frozen-lockfile` fails after changing dependencies

If you intentionally changed `package.json`, run:

```bash
pnpm install
```

Review the resulting `pnpm-lock.yaml` changes before committing them. For normal setup without dependency changes, continue using `pnpm install --frozen-lockfile`.
