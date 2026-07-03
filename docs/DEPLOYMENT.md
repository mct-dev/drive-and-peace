# Deployment

Drive + Peace deploys to **GitHub Pages** automatically on every push to `main`.

## Production URL

https://mct-dev.github.io/drive-and-peace/

## One-time setup (repo admin)

1. Open **Settings → Pages**: https://github.com/mct-dev/drive-and-peace/settings/pages
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Select branch **`gh-pages`**, folder **`/ (root)`**
4. Save

The workflow pushes built files to the `gh-pages` branch using `peaceiris/actions-gh-pages`.

> **Note on auto-build:** Pushes made with the default `GITHUB_TOKEN` do not always trigger a GitHub Pages build for branch-based hosting. The first live deploy may require a non-bot push to `gh-pages`. For fully automated deploys, add a repo secret named `GH_PAGES_TOKEN` (a fine-scoped personal access token with `repo` or `contents: write`) and set `personal_token: ${{ secrets.GH_PAGES_TOKEN }}` in the workflow.

## How it works

- Workflow: `.github/workflows/deploy.yml`
- Jobs: **deploy** → **verify**
- Runs `npm test` and `npm run build` on Ubuntu
- Publishes `dist/` to the `gh-pages` branch (includes `.nojekyll` for SPA routing)
- **verify** job curls production and checks for `Drive + Peace` in the HTML
- Agents should also run `npm run verify:deploy` locally after deploy

## Verify production manually

```bash
npm run verify:deploy
```

Retries for up to ~6 minutes. Exits non-zero if the site is not live.

## Agent / Cursor rule

`.cursor/rules/deployment.mdc` requires every agent delivery to:

1. Pass tests and build locally
2. Merge to `main` and confirm the deploy workflow succeeds
3. Run `npm run verify:deploy` (or confirm the workflow **verify** job passed)
4. Include the production URL in the final response
