# Development Copy

This directory is a separate development copy of the Deda project.

Goal:
- Make changes here without risking the active production project.

Safe workflow:
- Keep all experiments in this repository only.
- Commit before each substantial change.
- Run `npm run check` before deployment.
- Deploy this copy to a separate Vercel project or preview deployment, not to the current production target.

Recommended local setup:
1. Install dependencies with `npm install`.
2. Copy values from `.env.local` only if this copy really needs the same services.
3. Start local development with `npm run dev`.
4. Validate with `npm run check`.

Recommended git workflow:
1. Keep `main` stable in this copy.
2. Create short-lived feature branches for risky changes.
3. Merge only after local verification.

Recommended Vercel workflow:
1. Link this folder to a separate Vercel project.
2. Use different environment variables for experiments when possible.
3. Do not connect this copy to the active production domain.

Current status:
- Local git repository initialized on July 20, 2026.
- Project scripts now include `lint`, `typecheck`, and `check`.
