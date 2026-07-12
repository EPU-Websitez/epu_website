import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// MAINTENANCE MODE
// ----------------------------------------------------------------------------
// While this flag is `true`, EVERY page request is served a self-contained
// "Under Maintenance" page. No routes, data, or APIs are touched.
//
// To bring the site back online:
//   1. Set MAINTENANCE_MODE = false
//   2. Rebuild & redeploy (see MAINTENANCE_MODE.md in the project root)
// ============================================================================
const MAINTENANCE_MODE = false;

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Under Maintenance — Erbil Polytechnic University</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1b417b 0%,#0f2547 100%);color:#fff;padding:24px}
.card{max-width:560px;width:100%;text-align:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:48px 32px}
.icon{width:84px;height:84px;margin:0 auto 24px;border-radius:50%;background:rgba(201,162,75,0.15);display:flex;align-items:center;justify-content:center}
h1{font-size:28px;margin-bottom:8px;font-weight:700}
.gold{color:#c9a24b}
p{opacity:.85;line-height:1.7;margin-top:12px;font-size:15px}
.langs{margin-top:24px;border-top:1px solid rgba(255,255,255,.12);padding-top:20px;font-size:14px;opacity:.85;line-height:2}
.brand{margin-top:28px;font-size:13px;letter-spacing:.5px;opacity:.6}
</style>
</head>
<body>
<div class="card">
<div class="icon">
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9a24b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
</div>
<h1>We'll be back <span class="gold">soon</span></h1>
<p>Our website is currently undergoing scheduled maintenance. We're working to improve your experience and will be back online shortly. Thank you for your patience.</p>
<div class="langs">
<div dir="rtl">ماڵپەڕەکە لە ئێستادا لەژێر چاککردنەوەدایە. بەم زووانە دەگەڕێینەوە.</div>
<div dir="rtl">الموقع قيد الصيانة حالياً. سنعود قريباً.</div>
</div>
<div class="brand">ERBIL POLYTECHNIC UNIVERSITY</div>
</div>
</body>
</html>`;

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "ku", "ar"],

  // Used when no locale matches
  defaultLocale: "en",
  localeDetection: false,
});

export default function middleware(req: NextRequest) {
  if (MAINTENANCE_MODE) {
    return new NextResponse(MAINTENANCE_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
