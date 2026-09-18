# Jack Ochieng — Technical Portfolio

A long-term engineering portfolio built with Next.js, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Main routes

- `/` — home
- `/projects` — portfolio projects
- `/projects/<slug>` — project case studies
- `/notes` — engineering notes
- `/notes/<slug>` — individual note pages
- `/about` — background and engineering direction
- `/resume` — resume/profile page

## Personalize it

Most personal details live in `data/site.ts`:

- public email
- GitHub URL
- LinkedIn URL
- CV path
- project repositories and demos
- project/notes status

Add your CV at `public/jack-ochieng-cv.pdf` before publishing the Resume page.

## Flagship project

The first flagship build lives at `projects/secure-api-platform/`. It is intentionally kept inside this repository so the portfolio and engineering project can evolve together.

## Publish to GitHub

See `GITHUB_SETUP.md` for the exact first-push command and repository Actions configuration.
