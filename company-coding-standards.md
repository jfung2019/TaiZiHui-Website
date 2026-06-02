# Company Coding Standards

Status: Draft
Owner: Senior Development Team
Applies to: All engineering projects; project-specific standards may add stricter or more detailed rules

## 1. Purpose

These standards define the minimum engineering quality bar for all company codebases.

Project-specific standards may add stricter rules for a framework, language, or repository, but must not weaken the principles in this document.

## 2. Standards Precedence

When standards appear to conflict, apply them in this order:

1. Security, compliance, and legal requirements.
2. Project-specific `coding-standards.md`.
3. Tech-stack-specific standards.
4. This company baseline.
5. Existing local code patterns.

Existing patterns should guide implementation details, but they should not justify repeating known bugs, unsafe behavior, or poor security practices.

## 3. Automation Usage

Automation tools, including code audit commands, should use this document as the company baseline and combine it with project-specific standards.

General rules:

- Read the project-specific `coding-standards.md` before applying this baseline.
- Cite the relevant section when reporting a finding where practical.
- Do not report personal preferences that are not defined here or in project-specific standards.
- Distinguish between correctness, security, maintainability, and style findings.
- Do not modify source code during read-only audit workflows unless the invoked command explicitly allows edits.

## 4. Core Principles

Code should be:

- Correct before clever.
- Easy to read, review, test, and maintain.
- Consistent with the surrounding codebase.
- Explicit about business rules, side effects, and error handling.
- Secure by default.
- Scoped to the requirement being implemented.

Avoid unnecessary abstraction, hidden behavior, unrelated refactors, and framework patterns not already used by the project.

## 5. Naming

Use clear, descriptive names.

General rules:

- Names should describe intent, not implementation details.
- Avoid abbreviations unless they are common in the business domain.
- Boolean names should read like conditions, such as `isActive`, `hasPermission`, or `canApprove`.
- Functions should use verb-based names, such as `calculateTotal`, `fetchUser`, or `validateInput`.
- Avoid vague names such as `data`, `item`, `temp`, `helper`, or `utils` unless the context is very small and obvious.

Project-specific standards should define exact casing rules, such as `camelCase`, `PascalCase`, `snake_case`, or file naming conventions.

## 6. Code Structure

Code should be organized around responsibility.

General rules:

- Keep functions focused on one clear task.
- Avoid deeply nested control flow where early returns would be clearer.
- Keep business logic separate from presentation, transport, or infrastructure code where practical.
- Do not duplicate business logic across files.
- Prefer small, readable modules over large files with mixed concerns.
- Avoid circular dependencies.

A file should have a clear reason to exist. If a file contains unrelated concepts, split it.

## 7. Maintainability

Code should be easy to change safely.

General rules:

- Avoid hidden global state and unexpected shared mutation.
- Avoid unrelated side effects in functions that appear to be pure.
- Keep shared utilities stable, focused, and well-named.
- Remove unused code, unused exports, dead branches, and stale feature flags when they are no longer needed.
- Prefer clear control flow over clever shortcuts.
- Keep public interfaces small and intentional.
- Do not add compatibility layers for unshipped or in-progress work unless explicitly required.

## 8. Type Safety and Data Contracts

All code should make data shape and assumptions explicit.

General rules:

- Prefer strong types over loosely typed values.
- Avoid `any`, untyped objects, and unchecked dynamic access unless there is a documented reason.
- Validate external input at system boundaries.
- Treat API responses, user input, environment variables, files, and third-party data as untrusted.
- Keep shared data contracts in a predictable location.
- Do not silently ignore unexpected data.

Project-specific standards should define preferred validation and typing tools.

## 9. Error Handling

Errors should be handled intentionally.

General rules:

- Handle errors at system boundaries, such as API calls, database operations, file operations, queues, and external services.
- Do not swallow errors without logging, reporting, or returning a meaningful failure state.
- Avoid generic error messages when a user or developer needs actionable context.
- Do not expose sensitive implementation details to end users.
- Prefer explicit failure paths over hidden fallback behavior.

A fallback is acceptable only when it is expected, safe, and visible enough for debugging.

## 10. Security

Security rules apply to all projects.

General rules:

- Never commit secrets, tokens, passwords, private keys, or credentials.
- Never log sensitive data.
- Validate and sanitize external input.
- Apply least privilege when accessing services, files, databases, and APIs.
- Avoid unsafe dynamic execution.
- Do not bypass authentication, authorization, CSRF, CORS, or permission checks without documented approval.
- Treat client-side data as untrusted.
- Keep security-sensitive logic easy to review.

Security issues should be treated as blocking unless explicitly accepted by the senior development team.

## 11. Dependencies

Dependencies should be added carefully.

General rules:

- Prefer existing project dependencies and standard library features.
- Add a new dependency only when it meaningfully reduces complexity or risk.
- Avoid large dependencies for small utilities.
- Check package maturity, maintenance, license, and security risk.
- Do not introduce multiple libraries that solve the same problem without a clear reason.

Project-specific standards should define approved libraries and package managers.

## 12. Testing

Tests should protect important behavior.

General rules:

- Add or update tests when behavior changes.
- Prioritize business-critical flows, edge cases, and regression-prone logic.
- Do not write tests that only duplicate implementation details.
- Tests should be deterministic and independent.
- Mock external systems only where necessary.
- Bug fixes should include regression coverage when practical.

Project-specific standards should define test tools, commands, and minimum coverage expectations.

## 13. Logging and Observability

Logs should help diagnose real issues.

General rules:

- Log meaningful events at system boundaries and failure points.
- Include enough context to debug without exposing sensitive data.
- Avoid noisy logs in normal successful flows.
- Use consistent log levels where the platform supports them.
- Errors should be traceable across services where practical.

## 14. Performance

Code should avoid obvious waste.

General rules:

- Do not introduce unnecessary repeated work in hot paths.
- Avoid inefficient loops, excessive network calls, and large synchronous operations.
- Prefer pagination, batching, caching, or streaming when handling large data.
- Optimize based on evidence for complex performance work.
- Do not sacrifice readability for micro-optimizations without measurable benefit.

## 15. Accessibility and User Experience

User-facing work should be usable and clear.

General rules:

- Preserve accessibility semantics where applicable.
- Provide clear loading, empty, error, and success states.
- Avoid confusing or silent failures.
- Do not break keyboard navigation or screen reader behavior.
- User-facing text should be consistent with product terminology.

Project-specific frontend standards should define detailed accessibility requirements.

## 16. Comments and Documentation

Comments should explain why, not repeat what the code already says.

General rules:

- Add comments for non-obvious business rules, tradeoffs, constraints, or external system behavior.
- Remove outdated comments.
- Do not leave commented-out code.
- Public APIs, shared utilities, and complex flows should have enough documentation for safe reuse.

## 17. Formatting and Whitespace

Formatting should be consistent and free of noise in diffs.

General rules:

- Do not leave trailing whitespace at the end of lines.
- Remove trailing whitespace when editing a file.
- Follow each project’s formatter and linter for indentation, line endings, and statement terminators.
- Project-specific standards should define language-specific rules such as semicolons, quote style, or import ordering.

## 18. Pull Request Quality

A PR should be easy to review.

General rules:

- Keep PRs focused on one purpose.
- Avoid mixing feature work with unrelated refactors.
- Explain the reason for the change.
- Include screenshots, test evidence, or logs when relevant.
- Call out risk areas and known limitations.
- Do not leave debug code, temporary files, or unused code.

## 19. Code Audit Severity

Use these severities when auditing code.

### [BLOCKING]

Must be fixed before merge:

- Security vulnerabilities.
- Likely runtime bugs.
- Broken authentication or authorization.
- Data loss or data corruption risk.
- Unhandled failures at critical system boundaries.
- Type errors or build errors.
- Missing tests for high-risk behavior changes.

### [WARNING]

Should be fixed unless there is a clear reason:

- Repeated style violations.
- Trailing whitespace at the end of lines in changed files.
- Confusing naming.
- Duplicated business logic.
- Weak error messages.
- Overly complex functions.
- Missing tests for moderate-risk changes.

### [INFO]

Advisory only:

- Minor readability improvements.
- Small consistency issues.
- Refactoring opportunities.
- Documentation improvements.

## 20. Project-Specific Standards

Each project or tech-stack folder should maintain its own `coding-standards.md` that defines:

- Tech stack and framework conventions.
- Folder structure.
- Naming and file conventions.
- Approved libraries and patterns.
- Testing commands.
- Build, lint, and typecheck commands.
- Project-specific audit rules.
- Examples of preferred and discouraged patterns.
