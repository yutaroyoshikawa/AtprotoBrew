# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Atprotobrew is a launcher app for services built on the AT Protocol. It ships an "app store" experience (`org.tarororo.brew.*` lexicons) that lets users discover and open AT Protocol-compatible web services.

## Monorepo structure

pnpm workspaces monorepo. Each package is invoked via root-level filter aliases.

| Package | Alias | Stack |
|---|---|---|
| `packages/atprotobrew-app` | `pnpm app` | Expo / React Native (iOS, Android) |
| `packages/atprotobrew-web` | `pnpm web` | React 19 + Vite + TailwindCSS v4 |
| `packages/back` | `pnpm back` | Cloudflare Worker + Hono + XRPC |
| `packages/atproto` | `pnpm atproto` | AT Protocol Lexicon definitions (JSON → TS types) |
| `packages/common` | `pnpm common` | Shared UI (Tamagui), state (Jotai), data fetching (TanStack Query), i18n |

## Commands

### Root-level
```sh
pnpm check          # Biome lint + format (staged files)
pnpm sd:build       # Compile design tokens (tokens/ → packages/common/src/styles/)
```

### Backend (`packages/back`)
```sh
pnpm back dev       # Start Cloudflare Worker dev server (wrangler dev)
pnpm back lexgen    # Generate Hono XRPC handlers from lexicons
pnpm back cf-typegen  # Regenerate Cloudflare bindings type file
```

### Web (`packages/atprotobrew-web`)
```sh
pnpm web dev        # Vite dev server
pnpm web build      # tsc + Vite production build (output: dist/, consumed by wrangler)
pnpm web i18n:extract   # Extract LinguiJS message catalog
pnpm web i18n:compile   # Compile message catalog to TS
```

### Mobile app (`packages/atprotobrew-app`)
```sh
pnpm app start      # Expo dev server
pnpm app ios        # Run on iOS simulator
pnpm app android    # Run on Android emulator
pnpm app i18n:extract
pnpm app i18n:compile
```

### AT Protocol package (`packages/atproto`)
```sh
pnpm atproto lexgen  # Generate TypeScript types from lexicon JSON files
```

### Common package (`packages/common`)
```sh
pnpm common i18n:extract
pnpm common i18n:compile
```

## Architecture

### Deployment model
The backend (`wrangler.jsonc`) is a single Cloudflare Worker that:
- Routes `/xrpc/**` requests to the Hono XRPC handler
- Serves everything else as a single-page application from `packages/atprotobrew-web/dist/`

Before deploying, run `pnpm web build` so the `dist/` directory is up to date.

### AT Protocol / XRPC
Custom lexicons live in `packages/atproto/lexicons/org/tarororo/brew/`:
- `storeItem.json` — a store listing record type
- `launcher.json` — a user's launcher config record type
- `getLauncher.json` — XRPC query to fetch the launcher view

Workflow when changing lexicons:
1. Edit JSON files in `packages/atproto/lexicons/`
2. Run `pnpm atproto lexgen` to regenerate `packages/atproto/src/lexicons/`
3. Run `pnpm back lexgen` to regenerate the Hono XRPC server stubs in `packages/back/src/lexicons/`

### Backend auth (`packages/back/src/auth.ts`)
Implements AT Protocol service JWT verification: resolves the caller's DID document, extracts the verification key, and verifies the JWT signature (ES256K supported via `@atproto/crypto`). Also validates `lxm` (lexicon method) claim against the request path.

### Shared package exports (`packages/common`)
Exports are subpath-based. Import from:
- `@atprotobrew/common/core/components/*` — shared UI components
- `@atprotobrew/common/core/stores/*` — Jotai atoms (e.g., `languageStore`)
- `@atprotobrew/common/core/modules/*` — shared logic
- `@atprotobrew/common/auth/components/*` — auth UI
- `@atprotobrew/common/channel/components/*` — channel UI
- `@atprotobrew/common/channel/modules/*` — channel logic
- `@atprotobrew/common/theme` — Tamagui config
- `@atprotobrew/common/i18n/locales/*` — compiled message catalogs

### Design tokens
Source of truth: `tokens/*.json` (colors, typography, spacing, shadows, etc.)
Generated outputs (do not edit directly):
- `packages/common/src/styles/tokens.ts` — TypeScript constants for Tamagui
- `packages/common/src/styles/variables.css` — CSS custom properties for the web app

Run `pnpm sd:build` after changing token JSON files.

### i18n
LinguiJS is used across all packages. **Source locale is Japanese (`ja`)**; English (`en`) is the translation target. Each package runs its own `i18n:extract` / `i18n:compile`. The root `lingui.config.ts` sets project-wide options (`compileNamespace: "ts"`).

### Linting and formatting
Biome is the single tool for both linting and formatting. Config: `biome.json` (extends `shared/biome.jsonc`). Auto-generated lexicon files (`**/lexicons/**/*.ts`) are excluded from linting.

### Coding conventions

**padding-line-between-statements** — Biome は自動修正しないため、コードを書く時点で空行を正しく配置すること。詳細ルールは `.claude/skills/padding-line-between-statements/SKILL.md` を参照。要点:

- `return` / `throw` の直前には空行を入れる（関数の最初のステートメントを除く）
- `if` / `for` / `while` / `try` などブロック文の前後には空行を入れる（最初のステートメントを除く）
- 変数宣言グループの後、次のステートメントが別の種別なら空行を入れる
- 関数宣言・`export` 文の前後には空行を入れる
