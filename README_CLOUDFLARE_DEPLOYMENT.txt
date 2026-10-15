KLIKTIVA — CLOUDFLARE WORKER DEPLOYMENT PACKAGE v1

Purpose
This package combines the product files from the user-designated Kliktiva baseline ZIP with the Cloudflare Worker deployment configuration. The baseline product files are preserved; Cloudflare-specific entry/configuration files are added for deployment.

IMPORTANT
- This package has NOT been live-verified on the user's Cloudflare account. Test it as a new project first.
- Do not delete or overwrite the existing live website/deployment until the new deployment passes tests.
- Do not commit secrets or tokens. Configure APPS_SCRIPT_URL in Cloudflare Worker runtime variables/secrets.
- Keep this GitHub repository private.

GitHub upload
1. Create/open the intended PRIVATE repository.
2. Upload the CONTENTS of this ZIP to the repository root (not the ZIP itself and not inside a nested folder).
3. Confirm `wrangler.jsonc`, `src/index.js`, `public/index.html`, and `public/admin.html` are at the paths shown.
4. Connect the repository to a NEW Cloudflare Worker deployment.
5. Configure APPS_SCRIPT_URL with the existing valid Apps Script Web App /exec URL.
6. Verify build success and test /, /admin, /admin/, and API before attaching the production domain.

Routing intent
- / and static paths are served from public assets.
- /admin and /admin/ are served internally from public/admin.html without HTTP redirect.
- /api and /api/* are handled by src/index.js and forwarded to Apps Script.

This package is a deployment candidate, not a claim that deployment or account configuration has already been verified.
