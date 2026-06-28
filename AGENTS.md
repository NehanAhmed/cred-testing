<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# cred-testing — Cred API Testing Application

This is a **backend API testing application** for the **Cred** authentication service. Every feature is specified in `PRD.md`. Build features by referencing the PRD section number.

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
- All shadcn/ui imports go through `@/components/ui/` (e.g., `@/components/ui/button`)
- Form components are from `@/components/ui/form` — uses react-hook-form + radix-ui
- Toast notifications via `sonner` (Toaster is already mounted in layout)

## Env

- `.env*` is gitignored — use `.env.local` for local secrets
- `NEXT_PUBLIC_API_URL=http://localhost:3000` — the Cred backend URL (used by proxy.ts)

---

## Infrastructure already set up

**Do NOT re-create any of these files.** They are ready and should be imported/used:

### API Proxy (`proxy.ts`)

Forward `/api/*` to the Cred backend at `NEXT_PUBLIC_API_URL`. This solves the cross-origin httpOnly cookie problem — the browser talks to the Next.js server (same origin), which proxies to Cred. Cookies work naturally, no CORS needed.

All API calls go to relative paths like `/api/auth/login`, never to `http://localhost:3000/api/...`.

### Core Library — `lib/api-client.ts`

A typed fetch wrapper that classifies every API response into a discriminated union:

```typescript
type ApiResult<T> =
  | { kind: "success"; status: number; headers: Headers; body: { success: true; message: string; data: T } }
  | { kind: "api-error"; status: number; headers: Headers; body: { success: false; message: string; error: string } }
  | { kind: "validation-error"; status: number; headers: Headers; body: { errors: ValidationIssue[] } }
  | { kind: "rate-limit"; status: number; headers: Headers; body: { message: string } }
  | { kind: "redirect"; status: number; headers: Headers; location: string }
  | { kind: "network-error"; error: Error }
```

Usage: `const result = await apiCall<MyType>("/api/health")`, then switch on `result.kind`.

### Typed API Functions — `lib/api/*`

| File | Key Exports |
|---|---|
| `lib/api/health.ts` | `fetchHealth()` → `HealthData` |
| `lib/api/auth.ts` | `register()`, `login()`, `logout()`, `refreshToken()`, `forgotPassword()`, `resetPassword()` |
| `lib/api/profile.ts` | `getProfile()`, `updateProfile()`, `deleteAccount()`, `changePassword()` |
| `lib/api/audit.ts` | `getAuditLogs(page, limit)` |
| `lib/api/oauth.ts` | `OAUTH_ROUTES` constant, `getOAuthInitUrl(provider)` |

All return `Promise<ApiResult<T>>`.

### Zod Schemas — `lib/schemas/*`

Mirror the Cred API validation rules. Key schemas:

| File | Schemas |
|---|---|
| `lib/schemas/common.ts` | `passwordSchema` (8+ chars, uppercase, digit), `usernameSchema` (3-30), `emailSchema`, `genderSchema` |
| `lib/schemas/auth.ts` | `registerSchema`, `loginSchema`, `passwordForgotSchema`, `passwordResetSchema`, `passwordChangeSchema` |
| `lib/schemas/profile.ts` | `profileUpdateSchema` |

### React Query Provider — `providers/query-provider.tsx`

Wraps the app in `QueryClientProvider` + DevTools. Configured with:
- `staleTime: Infinity`, `retry: false`, `refetchOnWindowFocus: false`
- Already mounted in `app/layout.tsx`

### Custom Hooks — `hooks/*`

| Hook | What It Does |
|---|---|
| `hooks/use-auth-state.ts` | Auto-checks auth via `GET /api/profile/me` on mount. Returns `{ user, isAuthenticated, isLoading, checkAuth, clearAuth }` |
| `hooks/use-health-query.ts` | `useQuery` for health check |
| `hooks/use-profile-mutations.ts` | `useUpdateProfile()`, `useDeleteAccount()`, `useChangePassword()` — each is a `useMutation` |
| `hooks/use-audit-query.ts` | Paginated `useQuery` — `useAuditLogs(page, limit)` |
| `hooks/use-api-call.ts` | Generic manual trigger hook — `useApiCall<T>()` returns `{ result, isPending, execute(fn), reset }` |

### Reusable Components

| Component | File | Purpose |
|---|---|---|
| `ResponseViewer` | `components/response-viewer.tsx` | Renders any `ApiResult` — status badge, color-coded, response body, headers, redirect location, errors. Props: `result: ApiResult<T> \| null`, `isPending?: boolean` |
| `EndpointSection` | `components/endpoint-section.tsx` | Collapsible card wrapper with title, description, method+path badge. Props: `title`, `description?`, `method?`, `path?`, `children` |

### shadcn/ui Components Available

All at `@/components/ui/`: `button`, `card`, `input`, `label`, `select`, `tabs`, `badge`, `skeleton`, `sonner` (toast), `form` (react-hook-form integration)

### OAuth Callback Page

`app/auth/callback/page.tsx` — receives OAuth redirect, reads `error` query param, calls profile to verify auth. The page uses `Suspense` + `force-dynamic`.

---

## How to build features

1. Read the relevant section from `PRD.md`
2. Create feature components/pages under `app/` or `components/`
3. Import from `lib/api/*` for API calls
4. Use `ResponseViewer` to display results, `EndpointSection` for layout
5. Use `useApiCall<T>()` for manual trigger + state, or React Query hooks for auto-fetching
6. Use `react-hook-form` + `@/components/ui/form` for forms with Zod validation via `@hookform/resolvers/zod`
7. Use `sonner` toast for notifications: `import { toast } from "sonner"`
8. Use `useAuthState()` for auth status, `checkAuth()` post-action to refresh
9. All pages that use `useSearchParams()` must be wrapped in `Suspense`

Run `pnpm format && pnpm lint && pnpm typecheck && pnpm build` before marking feature complete.
