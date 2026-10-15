const ALLOWED_ACTIONS = new Set([
  'getLicenseStatus', 'activateLicense', 'adminLogin', 'getPublicData', 'adminGetData',
  'adminSaveProfile', 'adminRemoveProfilePhoto', 'adminSaveProduct', 'adminRefreshProductThumbnail', 'adminDeleteProduct', 'adminSaveCollection',
  'adminDeleteCollection', 'adminSaveCollectionOrder', 'adminSaveDisplayOrder', 'adminGetAccounts', 'adminSaveAccount',
  'adminDeleteAccount', 'adminGetDisplayProducts', 'trackAnalyticsEvent', 'adminGetAnalytics', 'uploadImageToDrive', 'cekKonfigurasiDrive'
]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}

async function handleApi(request, env) {
  if (request.method !== 'POST') return json({ ok: false, code: 'METHOD_NOT_ALLOWED', error: 'Gunakan metode POST.' }, 405);
  const scriptUrl = String(env.APPS_SCRIPT_URL || '').trim();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^\s]+\/exec(?:\?.*)?$/.test(scriptUrl)) {
    return json({ ok: false, code: 'APPS_SCRIPT_URL_NOT_CONFIGURED', error: 'APPS_SCRIPT_URL belum dikonfigurasi dengan URL Web App Apps Script yang berakhiran /exec.' }, 500);
  }
  let input;
  try { input = await request.json(); } catch { return json({ ok: false, code: 'INVALID_JSON', error: 'Body request harus berupa JSON.' }, 400); }
  const action = String(input?.action || '');
  const args = Array.isArray(input?.args) ? input.args : [];
  if (!ALLOWED_ACTIONS.has(action)) return json({ ok: false, code: 'ACTION_NOT_ALLOWED', error: 'API action tidak dikenal atau tidak diizinkan.' }, 400);
  try {
    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=utf-8', 'accept': 'application/json' },
      body: JSON.stringify({ action, args }),
      redirect: 'follow'
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); }
    catch { return json({ ok: false, code: 'APPS_SCRIPT_BAD_RESPONSE', error: 'Apps Script tidak mengembalikan JSON. Periksa deployment Web App dan URL /exec.' }, 502); }
    if (!upstream.ok) return json({ ok: false, code: result?.code || 'APPS_SCRIPT_HTTP_ERROR', error: result?.error || `Apps Script merespons HTTP ${upstream.status}.` }, 502);
    if (result?.ok !== true) return json({ ok: false, code: result?.code || 'BACKEND_ERROR', error: result?.error || 'Backend Apps Script mengembalikan kesalahan.' }, 400);
    return json({ ok: true, data: result.data });
  } catch (error) {
    return json({ ok: false, code: 'APPS_SCRIPT_UNREACHABLE', error: `Gagal menghubungi Apps Script: ${error?.message || String(error)}` }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return handleApi(request, env);

    // Serve /admin as admin.html internally, never with an HTTP redirect.
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      const target = new URL('/admin.html', url.origin);
      target.search = url.search;
      return env.ASSETS.fetch(new Request(target, request));
    }

    return env.ASSETS.fetch(request);
  }
};
