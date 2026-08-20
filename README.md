# Privacy Peek

Privacy Peek reads a website's public privacy documents and scores five parts of its data practices. The result is a short report you can inspect or compare with up to three other sites.

[Open Privacy Peek](https://privacy.experiments.kigo.ke)

## What it does

- Finds a site's official privacy policy and related legal pages.
- Extracts clauses about data collection, sharing, retention and security, user controls, and clarity.
- Scores each category and calculates a weighted overall score.
- Stores reports so repeat searches return an existing result instead of running another analysis.
- Shows the clauses behind each score and supports side-by-side comparison for four sites.
- Allows an old report to be analysed again when its source policies change.

The score is a reading aid, not legal advice. Language models can miss context or interpret vague policy text differently from a lawyer. The report keeps its supporting clauses visible for that reason.

## How it is put together

The web app uses Next.js and React. Convex stores sites, tags, category scores, and analysis job state. Groq models find current policy URLs, extract clauses, and produce structured scores.

The browser extension lives in the separate [privacy-peek-extension](https://github.com/KigoJomo/privacy-peek-extension) repository.

## Run it locally

You need Node.js, npm, a Convex deployment, and a Groq API key.

```bash
npm install
npx convex dev
npm run dev
```

Set these values in `.env.local`.

```dotenv
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
GROQ_API_KEY=your-key
```

Convex may also write deployment metadata to `.env.local` when you run `npx convex dev`.

## Checks

```bash
npm run lint
node --test tests/*.spec.mjs
```

The current automated tests cover shared formatting and sidebar state. They do not exercise live policy fetching or model output.
