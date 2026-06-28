<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# cred-testing

## Dev commands

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # ESLint v9 (flat config, eslint.config.mjs)
pnpm format       # Prettier (no semicolons, double quotes, trailing commas)
pnpm typecheck    # tsc --noEmit
```

Run in this order: `pnpm format && pnpm lint && pnpm typecheck && pnpm build`.

## Stack

- **Next.js 16.2.6 + React 19.2.4** — read `node_modules/next/dist/docs/` before coding
- **pnpm** (no monorepo — `pnpm-workspace.yaml` has empty `packages`)
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no `tailwind.config` file)
- **shadcn/ui** (`radix-nova` style), import from `@/components/ui/`
- **Dark mode**: `next-themes`, toggle via `d` key (see `components/theme-provider.tsx`)
- **Fonts**: Geist (sans), Geist Mono, Roboto Slab (serif) via next/font

## Conventions

- `@/*` path alias maps to project root
- Use `cn()` from `@/lib/utils` for class merging
- No test framework installed yet

## Env

- `.env*` is gitignored — create `.env.local` for local secrets
- No CI workflows configured
