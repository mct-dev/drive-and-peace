# Deployment

Drive + Peace deploys to **GitHub Pages** automatically on every push to `main`.

## Production URL

https://mct-dev.github.io/drive-and-peace/

## One-time setup (repo admin)

If the deploy workflow fails with *"Ensure GitHub Pages has been enabled"*:

1. Open **Settings → Pages**: https://github.com/mct-dev/drive-and-peace/settings/pages
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Re-run the latest **Deploy to GitHub Pages** workflow (or push any commit to `main`)

No other secrets or paid services are required.

## How it works

- Workflow: `.github/workflows/deploy.yml`
- Jobs: **build** → **deploy** → **verify**
- Runs `npm test` and `npm run build` on Ubuntu
- Publishes the `dist/` folder to GitHub Pages
- **verify** job curls production and checks for `Drive + Peace` in the HTML
- Agents should also run `npm run verify:deploy` locally after deploy

## Verify production manually

```bash
npm run verify:deploy
```

Retries for up to ~5 minutes. Exits non-zero if the site is not live.
- Vite `base` is `/drive-and-peace/` for project-site hosting
- `dist/404.html` is copied from `index.html` for client-side routing

## Agent / Cursor rule

`.cursor/rules/deployment.mdc` requires every agent delivery to:

1. Pass tests and build locally
2. Merge to `main` and confirm the deploy workflow succeeds
3. Include the production URL in the final response
