<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Coding standards

Read these instructions before writing any code.

Write code like a senior Go engineer — even if we're writing JavaScript/TypeScript. This means:

- Explicit over clever. No unnecessary destructuring, spread operators, or one-liner tricks.
- Clear variable names that describe what they hold.
- Error handling at every boundary, not just happy path.
- Functions that do one thing and are easy to read top-to-bottom.
- No magic. If someone reads this code in 6 months, they should understand it immediately.
- Prefer simple loops over chained array methods when readability suffers.
- Type everything. No `any`, no implicit types.

Readability is the #1 priority. Clever code is a liability.

## Debugging

When debugging, always provide a root fix — not just a patch fix. Trace the error back to its actual cause. Explain what went wrong at the source level, why the surface-level fix is insufficient, and implement the proper solution that prevents the issue from recurring.

## Security reviews

Review code as a security auditor. Think like an attacker — identify vulnerabilities, injection points, authentication weaknesses, exposed secrets, and unsafe data handling. For each issue found, explain the risk level (critical/high/medium/low), how it could be exploited, and provide the specific fix. Prioritize OWASP Top 10 vulnerabilities.

