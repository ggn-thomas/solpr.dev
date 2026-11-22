@AGENTS.md

# solpr.dev

Private-transfer web app on Solana, powered by Helius **Solana Privacy Rings** (shielded pools: deposit public → private, send privately, withdraw private → public).

**Current phase: frontend only.** We are re-implementing the Claude Design mockup in Next.js + React. No wallet connection, no Privacy API calls, no backend yet. Controls that need them ("Connect wallet", `MAX`, token selector) are rendered but inert. Do not add SDKs, wallet adapters or API routes until asked.

## Sources of truth

| What | Where |
| --- | --- |
| Mockup (screens) | https://claude.ai/artifact/LcuTyxWX8hhtJPMe5xBJqz — `App.dc.html` = private transfer screen, `Main.dc.html` = landing page |
| Design system | https://claude.ai/artifact/UJLBPcbiCwFuqj7K7TjMY2 — read `project/README.md`, `project/tokens.json`, `project/components/bundle.css` |
| Product context | https://www.helius.dev/privacy, docs at https://www.helius.dev/docs/privacy |
| Next.js docs for the installed version | `node_modules/next/dist/docs/` (read before using an API; this is Next 16) |

Only the **private transfer** screen is in scope for now. The landing page comes later.

## Commands

```bash
pnpm dev      # dev server
pnpm build    # production build (also type-checks)
pnpm lint     # eslint
```

Package manager is **pnpm**. Do not use npm or yarn.

## Stack

- Next.js 16 (App Router, `src/` folder), React 19, TypeScript strict
- Styling: CSS Modules + design tokens as CSS custom properties in `src/app/globals.css`. No Tailwind, no CSS-in-JS, no UI library.
- Fonts: `next/font/google` (Oxanium, Space Mono, Inter), exposed as CSS variables
- Images: `next/image`, files in `public/`

## Project structure

Feature-based layout on top of the Next.js App Router conventions. `app/` routes, `features/` owns business domains, `components/` is generic UI, `lib/` is configuration and external clients, `providers/` is global React context.

```
src/
  app/                          # routing and backend endpoints only
    layout.tsx                  # root layout: <html>, fonts, metadata
    globals.css                 # tokens (CSS variables) + base reset only
    (app)/                      # route group: product screens
      layout.tsx                # app shell, fills the viewport (header; WalletProvider later)
      page.tsx                  # "/" is the private transfer screen, the main page
    api/                        # (later) Route Handlers
      helius/route.ts           # secure proxy to the Helius SDK (API key stays server-side)
      webhooks/helius/route.ts  # Helius on-chain event webhooks
  features/                     # business logic split by domain
    privacy-transfers/
      components/               # UI used only by this feature
      hooks/                    # (later) e.g. use-private-transfer.ts
      types.ts
    wallet/
      components/               # connect button, network selector
  components/                   # generic, shared UI
    ui/                         # design-system components: button, tabs, panel, field, chip, select-button
    layout/                     # shell pieces: header
    decor/                      # brand motifs: pixel-mask, ascii-corner
  lib/                          # (later) configuration and external clients
    helius/server.ts            # Helius SDK instance (import 'server-only')
    helius/client.ts            # fetch calls to /api/helius
    solana/connection.ts        # RPC config pointing at the /api/helius proxy
  providers/                    # (later) global React contexts, e.g. wallet-context-provider.tsx
public/                         # static assets (hero photo)
```

Entries marked "(later)" are the agreed target and do not exist yet: create them when the backend and wallet phases start, not before. No empty placeholder folders.

Rules:

- `app/` is for routing. Only Next special files (`page`, `layout`, `loading`, `error`, `not-found`, `route`, `template`, `default`, metadata files) and a `page.module.css` beside a page go there. Pages compose feature components; they hold no business logic.
- A feature never imports from another feature's internals. Shared pieces move to `components/` or `lib/`.
- `components/ui` knows nothing about Solana, Helius or wallets: props in, markup out.
- The Helius API key never reaches the browser: client code calls `/api/helius`, only `lib/helius/server.ts` touches the SDK.
- Import with the `@/*` alias (`@/components/ui/button`), never long relative paths across folders.
- **File names are kebab-case** everywhere in `src/` (enforced by `.claude/hooks/pre-edit-guard.sh`): `transfer-panel.tsx` exports `TransferPanel`, with `transfer-panel.module.css` beside it. One component per file. Named exports for components; default exports only where Next requires them (`page`, `layout`).
- **Server Components by default.** Add `"use client"` only on the smallest component that needs state, effects or event handlers, and keep it a leaf.
- Use `<Link>` for internal navigation, `<a>` for external links, `<button type="button">` for actions.
- Metadata through the `metadata` export, not manual `<head>` tags.

## Design rules (from the design system — do not improvise)

- **Values come from tokens.** Every colour, spacing, size and font in a CSS Module is a `var(--token)` from `globals.css`. No raw hex or ad-hoc px for something a token already names. Token names match `tokens.json` (`--ground`, `--accent`, `--ink-muted`, `--space-4`, `--control-md`…).
- One theme: dark. Pure black `--ground`, one orange `--accent`, no second hue. State is shown by fill and border.
- Square: `border-radius: 0` everywhere, no shadows, no decorative gradients. Borders are 1px.
- Type: Oxanium 700 for the one page headline; Space Mono for anything a machine would print (nav, buttons, tabs, labels, amounts, addresses, ASCII); Inter for sentences.
- Every interactive control is at least 44px tall (`--control-md`).
- Motion is light and must be wrapped in `@media (prefers-reduced-motion: no-preference)`.
- PixelMask, AsciiCorner and DataLabel are decoration: always `aria-hidden`.
- Accessibility: real `<label>` for every input, `aria-pressed` on tabs, visible `:focus-visible` outline, `aria-label` on icon-only buttons.

## Copy rules

- English, sentence case, no emoji, no exclamation marks.
- Nav links and tabs are bracketed: `[Deposit]`, `[Docs]`. Eyebrows are uppercase and start with `//`.
- Buttons: verb first, two or three words ("Connect wallet", "Send privately").
- Claim only what Helius documents (sender, recipient, asset and amount hidden by ZK proofs; self-custodial). Never invent fees, speeds or volumes.

## Working agreements

- Match the mockup exactly; when the mockup and the design system disagree, the mockup wins for that screen and the difference gets flagged.
- States the mockup does not draw (error, loading, disabled, connected wallet) are not designed yet: ask before inventing them.
- Commit only when asked.
