#!/usr/bin/env node
/**
 * Verify the production site is live and serving the app.
 * Used by agents after deploy and by the GitHub Actions workflow.
 */
const URL = process.env.PRODUCTION_URL ?? 'https://mct-dev.github.io/drive-and-peace/'
const MAX_ATTEMPTS = Number(process.env.VERIFY_ATTEMPTS ?? 30)
const DELAY_MS = Number(process.env.VERIFY_DELAY_MS ?? 10_000)
const EXPECTED = process.env.VERIFY_EXPECTED ?? 'Drive + Peace'

async function verify() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(URL, { redirect: 'follow' })
      const html = await res.text()

      if (res.ok && html.includes(EXPECTED)) {
        console.log(`✓ Production verified: ${URL} (HTTP ${res.status})`)
        return
      }

      console.log(
        `Attempt ${attempt}/${MAX_ATTEMPTS}: HTTP ${res.status}` +
          (res.ok ? ` — missing "${EXPECTED}" in response` : '') +
          ` — retrying in ${DELAY_MS / 1000}s…`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(`Attempt ${attempt}/${MAX_ATTEMPTS}: ${message} — retrying…`)
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, DELAY_MS))
    }
  }

  console.error(`✗ Production verification failed: ${URL}`)
  console.error(
    'If deploy succeeded but verify failed, GitHub Pages may not be enabled yet.',
  )
  console.error('Enable it once: https://github.com/mct-dev/drive-and-peace/settings/pages')
  console.error('Set Source to "GitHub Actions", then re-run the deploy workflow.')
  process.exit(1)
}

verify()
