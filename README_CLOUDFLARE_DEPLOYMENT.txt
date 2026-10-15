KLIKTIVA — CLOUDFLARE WORKER DEPLOYMENT PACKAGE v2

Fixes included in this package:
- Both public and admin frontend call /api (not Netlify's /.netlify/functions/api).
- Worker explicitly serves /index.html at / and /admin.html at /admin or /admin/ without redirects.
- Wrangler Worker name matches the existing Cloudflare Worker project: kliktiva-bio.
- Product frontend files are preserved from the designated Kliktiva baseline package.

Browser-only deployment:
1. Download and extract this ZIP.
2. Upload the CONTENTS to the ROOT of the GitHub repository connected to the intended Cloudflare Worker. Do not upload the ZIP itself or place everything inside a nested folder.
3. Replace the repository files with these package files, keeping the repository private.
4. Confirm the Cloudflare runtime variable APPS_SCRIPT_URL contains the existing Apps Script Web App URL ending in /exec. Do not paste secrets into GitHub.
5. Deploy the repository's main branch.
6. Test /, /admin, and POST /api. Keep any previous deployment available until all tests pass.

Important:
- This package has been checked for the known frontend API path mismatch and root routing issue, but cannot be live-tested against the user's Cloudflare account or Apps Script backend from this environment.
- If / and /admin load but data still fails, inspect the JSON error from POST /api; that will identify whether APPS_SCRIPT_URL or the Apps Script Web App response needs attention.
