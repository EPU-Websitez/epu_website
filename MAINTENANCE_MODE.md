# Maintenance Mode — EPU_WEBSITE

This project (the public website, served at **new.epu.edu.iq**, container `epu_website_web_1`,
host port `5005` → container `3000`) can be put into a full-screen **"Under Maintenance"**
state without touching any data, routes, or the database.

---

## How it works

A single flag in [`src/middleware.ts`](src/middleware.ts) controls it:

```ts
const MAINTENANCE_MODE = true;   // <-- true = site shows the maintenance page
```

When `MAINTENANCE_MODE === true`, the Next.js **middleware** intercepts every page
request (the matcher already excludes `/_next`, `/api`, and static files like images
and `favicon.ico`) and returns a self-contained HTML "Under Maintenance" page with
**HTTP 200**.

Key design points:
- **Nothing is deleted or changed** — the real app code, routes, and APIs are all still
  there, just not reachable while the flag is on. Flipping the flag back restores the
  site exactly as before.
- **Self-contained HTML** — the maintenance page uses only inline CSS (no external JS,
  CSS, fonts, or images), so it always renders even though the rest of the app is gated.
- **HTTP 200 (not 503)** — chosen so the page reliably displays through Cloudflare/Nginx
  and so Docker health checks keep passing. (If you prefer the SEO-correct `503 Service
  Unavailable`, change the `status: 200` in the middleware to `status: 503` and add a
  `'Retry-After': '3600'` header.)
- **Trilingual** — the message is shown in English, Kurdish, and Arabic.

---

## Turn maintenance OFF (bring the site back)

1. Edit [`src/middleware.ts`](src/middleware.ts):
   ```ts
   const MAINTENANCE_MODE = false;
   ```
2. Rebuild and redeploy (see commands below).

That's the only change required — the original middleware logic (next-intl locale
routing) runs again automatically.

---

## Build & deploy (exact commands used)

> `docker-compose` v1 on this host is broken for `up` (KeyError: ContainerConfig), so we
> **build with compose** and **run the container manually** with `docker run`.

```bash
cd /home/epuser6/Projects/EPU_WEBSITE

# 1. Build the new image (no cache)
docker-compose build --no-cache web
# Confirm "Compiled successfully" and "Successfully tagged epu_website_web:latest"

# 2. Replace the running container (config preserved, volumes untouched)
docker stop epu_website_web_1 && docker rm epu_website_web_1
docker run -d \
  --name epu_website_web_1 \
  --network epu_website_default \
  -p 5005:3000 \
  --env-file .env \
  -e NODE_ENV=production \
  --restart unless-stopped \
  epu_website_web:latest

# 3. Verify
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5005        # 200/307
curl -s http://127.0.0.1:5005/en | grep -o "We'll be back"           # maintenance text
```

---

## Data safety

This change is **frontend-only**:
- No database reads/writes, no migrations.
- No `/uploads` or Docker volume changes — the same container config is reused.
- Only `src/middleware.ts` (code) and this doc were added/edited.

**No data was deleted or modified at any point.**
