# Megaannum Frontend Coding Standards

Status: Draft
Owner: Senior Development Team
Applies to: `Megaannum-Frontend`

## 1. Company Baseline Dependency

This project follows the company baseline standard:

- `../company-dev-standards/company-coding-standards.md`

Before using this file for `/code-audit`, implementation, refactoring, or review, read the company baseline first.

If `../company-dev-standards/company-coding-standards.md` cannot be found, stop and ask the user to provide the correct path or the missing baseline file. Do not silently continue with only this project standard unless the user explicitly approves.

## 2. Project Context

This repository is a treasury management frontend built with:

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- Radix UI primitives
- Zustand
- Server actions
- Shared API client and `src/server` service modules
- API hooks under `src/hooks/api`
- `react-i18next` for translated user-facing text

This file defines project-specific rules that extend the company baseline for this frontend codebase.

## 3. Standards Precedence

When standards appear to conflict, apply them in this order:

1. Security, compliance, and data-protection requirements.
2. `coding-standards.md` in this project.
3. `../company-dev-standards/company-coding-standards.md`.
4. Existing local code patterns.

Existing code patterns should guide implementation, but they must not justify repeating known bugs, sensitive logging, weak type safety, or insecure configuration.

## 4. Production Quality Gates

Production-ready changes must be able to pass relevant quality gates.

Required expectations:

- Fix TypeScript errors before merge.
- Fix ESLint errors before merge.
- Treat `next.config.ts` settings that ignore lint or TypeScript build failures as temporary technical debt, not an acceptable production standard.
- Run `npm run lint` when the change affects TypeScript, React, imports, hooks, or formatting.
- Run `npm run build` when the change affects routing, configuration, server actions, API boundaries, or production behavior.
- If verification cannot be run, record what was not run and why.

## 5. TypeScript

Use TypeScript to make data contracts and frontend behavior explicit.

Rules:

- Prefer precise types for component props, hook parameters, API payloads, and API responses.
- Avoid `any`. If unavoidable, isolate it near the boundary and explain why.
- Keep domain types in `src/types` or the closest existing domain type module.
- Use `import type` for type-only imports.
- Prefer discriminated response shapes such as `APIResponse<T> | APIErrorResponse` for server/API boundaries.
- Do not cast API responses just to silence type errors. Fix or model the response shape instead.
- Use the `@/*` path alias for imports from `src`.

### TypeScript and JavaScript formatting

This project follows the company baseline for whitespace. Additional rules for `.ts`, `.tsx`, `.js`, and `.jsx` files:

- Do not leave trailing whitespace at the end of lines.
- End statements with semicolons.
- Match existing formatting in untouched code; new and edited code should follow these rules.
- Run `npm run lint` when formatting or style may be affected.

## 6. Next.js Boundaries

Keep server and client responsibilities clear.

Rules:

- Use `"use client"` only when a component needs client-side state, effects, browser APIs, event handlers, or client-only libraries.
- Keep server-side data access and external API calls in server actions or `src/server` modules.
- Do not use browser-only APIs in server code.
- Do not use server-only APIs in client components.
- Keep route `page.tsx` files focused on page composition. Move reusable UI, formatting, filtering, or data logic into components, hooks, or utilities when a page becomes difficult to review.
- Avoid hardcoded internal IPs, production hostnames, or environment-specific URLs in feature code. Use environment variables or central configuration.

## 7. React Components

Components should be focused, typed, and easy to review.

Rules:

- Use `PascalCase` for React component names.
- Keep component props explicit and typed.
- Prefer composition over large components with mixed concerns.
- Extract repeated UI patterns into reusable components.
- Keep business logic out of presentational UI components when practical.
- Always handle loading, error, empty, and success states for data-driven UI.
- Avoid derived state when a value can be calculated directly from props, query results, or existing state.
- Avoid side effects during render.

## 8. Hooks and State

Hooks should make data flow predictable.

Rules:

- Custom hooks must start with `use`.
- API hooks should live under `src/hooks/api`.
- API hooks should return typed data, `loading`, and `error` states consistently.
- `useEffect` dependency arrays must be correct and intentional.
- Use functional state updates when deriving new state from previous state.
- Do not suppress hook dependency warnings without a documented reason.
- Avoid calling server actions repeatedly due to unstable object dependencies. Memoize inputs or update state structure when needed.
- Clear or replace stale errors when a new request starts.

## 9. Server Actions and API Modules

Server actions and shared API modules are system boundaries and require stricter handling.

Rules:

- Keep feature server actions near their route group in `src/app/.../actions.ts`.
- Keep reusable API calls in `src/server`.
- Use the shared API response pattern where applicable.
- Return meaningful failure states instead of throwing raw errors to the UI.
- Do not expose stack traces, internal URLs, tokens, cookies, or implementation details to users.
- Keep retries intentional and bounded.
- Validate or normalize external data before passing it deep into UI components.

## 10. Security and Logging

This frontend handles financial and business data. Logging must be conservative.

Rules:

- Never log access tokens, cookies, authorization headers, credentials, or secrets.
- Do not log full request bodies, raw API responses, customer data, financial records, or personally identifiable information unless explicitly approved and redacted.
- Redact sensitive fields before logging at API boundaries.
- Do not commit temporary debug logging.
- Treat client-side values as untrusted.
- Do not bypass authentication, authorization, or logout behavior without senior approval.
- Avoid wildcard external domains in production configuration unless explicitly reviewed.

## 11. Styling and UI

Use the existing design system and Tailwind conventions.

Rules:

- Prefer existing components in `src/components/ui` and shared dashboard components before creating new primitives.
- Prefer Tailwind utilities for layout and styling.
- Use custom CSS only for third-party library overrides or cases Tailwind cannot express cleanly.
- Keep custom CSS scoped to a clear wrapper class.
- Use `cn` or existing class merge utilities when composing class names.
- Keep colors, breakpoints, and theme values aligned with `tailwind.config.ts`.
- Preserve Radix UI accessibility behavior when wrapping or extending primitives.

## 12. i18n and User-Facing Text

User-facing text should follow existing translation patterns.

Rules:

- Use `react-i18next` translation keys in features that already use i18n.
- Do not introduce hardcoded user-facing text inside translated areas.
- Keep translation keys meaningful and grouped by feature where practical.
- Technical error details should be logged safely, not exposed directly to end users.

## 13. Accessibility

User-facing UI should remain usable with keyboard and assistive technologies.

Rules:

- Preserve semantic HTML where possible.
- Buttons must be buttons, links must be links, and form controls must be labeled.
- Dialogs, dropdowns, selects, tabs, and menus should preserve Radix keyboard and focus behavior.
- Tables should keep meaningful headers and row structure.
- Loading and error states should be visible and understandable.
- Do not remove focus styles without providing an accessible replacement.

## 14. Configuration and Environment

Configuration should be explicit and safe for production.

Rules:

- Store environment-specific URLs and keys in environment variables.
- Do not hardcode internal IP addresses in application behavior.
- Do not rely on `NODE_TLS_REJECT_UNAUTHORIZED=0` outside local development.
- Avoid broad wildcard configuration for external resources unless it is reviewed and documented.
- Keep production configuration stricter than development configuration.

## 15. File and Naming Conventions

Follow existing repo structure and make names easy to search.

Rules:

- React components use `PascalCase`.
- Hooks use `useSomething`.
- Domain types use clear business names and live under `src/types`.
- Server modules live under `src/server/<domain>`.
- Feature server actions live in route-local `actions.ts`.
- Avoid typo-prone filenames and inconsistent casing.
- Avoid vague files such as `utils.ts` or `helpers.ts` when a domain-specific name would be clearer.

## 16. Known Existing Deviations

The following existing patterns should be treated as technical debt and not copied into new work:

- Production builds currently ignore ESLint and TypeScript errors in `next.config.ts`.
- The local development script disables TLS verification.
- Some API logging includes request or response details that may require redaction.
- Some configuration allows broad external hosts or hardcoded fallback URLs.
- Some large page components mix UI, state, filtering, formatting, and business logic.
- Some hook effects may rely on incomplete dependency arrays or stale state.

When `/code-audit` encounters these in unchanged legacy code, report them as existing risk unless the current change expands or depends on the pattern. New or modified code should follow the stricter standard in this file.

## 17. Verification Expectations

Use the smallest verification set that gives confidence for the change.

Common commands:

```bash
npm run lint
npm run build
```

Manual verification should cover the relevant UI state:

- Loading state
- Empty state
- Error state
- Success state
- Pagination, filtering, or sorting when affected
- Authentication or logout behavior when affected
- Responsive layout when the change affects dashboard or mobile routes

## 18. Code Audit Severity

Use the company severity labels and apply these project-specific examples.

### [BLOCKING]

Must be fixed before merge:

- Sensitive logging of tokens, cookies, authorization headers, raw responses, customer data, or financial data.
- TypeScript, lint, or build errors introduced by the change.
- Broken authentication, logout, authorization, or token handling.
- Browser/server boundary violations that can cause runtime failure.
- API failures that are swallowed without a visible error state.
- Hardcoded secrets or credentials.
- Hardcoded production-impacting internal URLs introduced by the change.
- Likely runtime bugs in data fetching, pagination, filtering, or form submission.

### [WARNING]

Should be fixed unless there is a clear reason:

- Weak or unnecessary `any` usage.
- Incomplete `useEffect` dependencies.
- Oversized components that mix unrelated concerns.
- Missing loading, error, or empty states.
- Repeated UI or business logic that should be extracted.
- Hardcoded user-facing text in translated features.
- Custom CSS where existing Tailwind or UI components would be clearer.
- Trailing whitespace at the end of lines in changed files.
- Missing semicolons in new or edited TypeScript or JavaScript.

### [INFO]

Advisory only:

- Minor naming improvements.
- Small formatting or consistency issues.
- Opportunities to extract reusable UI.
- Documentation improvements.
- Low-risk cleanup in unchanged legacy code.
