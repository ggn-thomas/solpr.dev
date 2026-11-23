@frontend/AGENTS.md

# solpr.dev

Private-transfer web app on Solana, powered by Helius **Solana Privacy Rings** (shielded pools: deposit public → private, send privately, withdraw private → public).

**Status: archived.** The project stopped before the Helius Privacy integration. The repository keeps the web interface as a record: the landing page and the private transfer screen, both from the Claude Design mockup. Nothing talks to Helius: tokens, prices and balances are example data (`features/privacy-transfers/mock-tokens.ts`) and the submit button never sends anything. A NestJS proxy backend for the Helius API key existed and was removed; it is in the git history (commit `86fa168`) if the integration is ever resumed.

**Wallet connection is real**, through Solana Wallet Adapter (`@solana/wallet-adapter-react` + `-base`, `@solana/web3.js` v1, which the adapter requires):

- `providers/wallet-context-provider.tsx` sets up `ConnectionProvider` and `WalletProvider` with `autoConnect`. Read state with `useWallet()` / `useConnection()` from `@solana/wallet-adapter-react`.
- No legacy adapters and no `@solana/wallet-adapter-wallets`: Wallet Standard wallets (Phantom, Solflare, Backpack...) are detected automatically.
- No `@solana/wallet-adapter-react-ui`: the picker is our own `features/wallet/components/wallet-dialog.tsx`, opened from anywhere with `useWalletPicker().open()`.
- RPC endpoint: `NEXT_PUBLIC_SOLANA_RPC_URL` if set, otherwise public devnet.

## Sources of truth

| What | Where |
| --- | --- |
| Mockup (screens) | https://claude.ai/artifact/LcuTyxWX8hhtJPMe5xBJqz — `App.dc.html` = private transfer screen, `Main.dc.html` = landing page |
| Design system | https://claude.ai/artifact/UJLBPcbiCwFuqj7K7TjMY2 — read `project/README.md`, `project/tokens.json`, `project/components/bundle.css` |
| Product context | https://www.helius.dev/privacy, docs at https://www.helius.dev/docs/privacy |
| Next.js docs for the installed version | `node_modules/next/dist/docs/` (read before using an API; this is Next 16) |

Routes: `/` is the landing page, `/app` the private transfer screen. The mockup also has a "Loading" screen (`Loader.dc.html`) that was not built.

## Repository layout

The app lives in `frontend/`, its own pnpm package. Run every command from there.

## Commands

```bash
# frontend/
pnpm dev      # dev server on :3000
pnpm build    # production build (also type-checks)
pnpm lint     # eslint
```

Package manager is **pnpm**. Do not use npm or yarn.

The post-edit hook (`.claude/hooks/post-edit-quality.sh`) runs Prettier, ESLint and `tsc` in the package that owns the edited file.

## Stack

- Next.js 16 (App Router, `src/` folder), React 19, TypeScript strict
- Styling: CSS Modules + design tokens as CSS custom properties in `src/app/globals.css`. No Tailwind, no CSS-in-JS, no UI library.
- Fonts: `next/font/google` (Oxanium, Space Mono, Inter), exposed as CSS variables
- Images: `next/image`, files in `public/`

## Project structure (frontend/)

Feature-based layout on top of the Next.js App Router conventions. `app/` routes, `features/` owns business domains, `components/` is generic UI, `providers/` is global React context.

```
src/
  app/                          # routing only
    layout.tsx                  # root layout: <html>, fonts, metadata
    globals.css                 # tokens (CSS variables) + base reset only
    (marketing)/                # route group: landing page
      layout.tsx                # shell with the bracketed nav and "Launch app"
      page.tsx                  # "/" landing hero
    (app)/                      # route group: product screens
      layout.tsx                # wallet providers + shell with the wallet controls
      app/page.tsx              # "/app" private transfer screen
  features/                     # business logic split by domain
    landing/
      components/               # landing backdrop (photo, mask, data labels, ASCII)
    privacy-transfers/
      components/               # UI used only by this feature
      hooks/                    # (later) e.g. use-private-transfer.ts
      types.ts
    wallet/
      components/               # connect button, network selector
  components/                   # generic, shared UI
    ui/                         # design-system components: button, button-link, tabs, panel, field, chip, select-button, modal
    layout/                     # shell pieces: header, page-shell
    decor/                      # brand motifs: pixel-mask, ascii-corner, data-label
  providers/                    # global React contexts: wallet-context-provider.tsx (Solana Wallet Adapter)
public/                         # static assets (hero photo)
```

Entries marked "(later)" were planned for the Helius integration and do not exist. No empty placeholder folders.

Rules:

- `app/` is for routing. Only Next special files (`page`, `layout`, `loading`, `error`, `not-found`, `route`, `template`, `default`, metadata files) and a `page.module.css` beside a page go there. Pages compose feature components; they hold no business logic.
- A feature never imports from another feature's internals. Shared pieces move to `components/`.
- `components/ui` knows nothing about Solana, Helius or wallets: props in, markup out.
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
