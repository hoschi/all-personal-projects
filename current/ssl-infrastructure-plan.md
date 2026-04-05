# SSL Infrastructure Plan for Local Monorepo Deployment

## Goal

Set up SSL infrastructure in the monorepo so all TanStack Start apps are reachable locally via HTTPS with readable domains, both from the developer machine and from mobile devices in the same LAN.

This is required for browser APIs restricted to secure contexts, especially:

- `navigator.mediaDevices.getUserMedia()` (microphone)
- `navigator.clipboard`

## Why This Approach

`*.localhost` is a secure context on desktop browsers, but mobile devices in LAN cannot resolve `*.localhost` to the developer machine.  
A central reverse proxy with SSL termination solves this for both local and LAN access.

## Chosen Solution: Caddy in Docker with `tls internal`

### Architecture

```text
Desktop Browser                           Mobile Browser (LAN)
    |                                           |
    | https://dev.sst.localhost                | https://sst.<LAN-IP>.sslip.io
    v                                           v
+---------------------------------------------------------------+
|                 Caddy (Docker, port 443)                     |
|                 tls internal (own CA)                        |
|                 reverse_proxy -> host apps                   |
+------------------------------+--------------------------------+
                               |
                               | host.docker.internal
                               v
+---------------------------------------------------------------+
|                    Host machine (macOS/Linux)                |
| switch-test dev:3057 prod:4057                               |
| box-storage dev:3058 prod:4058                               |
| sst         dev:3059 prod:4059                               |
+---------------------------------------------------------------+
```

### Benefits

- Repo-portable setup (config lives in repo).
- No `mkcert` dependency required.
- No HTTPS logic inside app code (apps stay on HTTP behind proxy).
- Automatic certificate management via Caddy internal CA.
- Stable trust model as long as Caddy `/data` volume is preserved.

## Port Convention

| App         | Dev Port | Prod Port |
| ----------- | -------- | --------- |
| switch-test | 3057     | 4057      |
| box-storage | 3058     | 4058      |
| sst         | 3059     | 4059      |

Rule: `prodPort = devPort + 1000`

## Planned Files

### 1) `infra/caddy/Caddyfile`

```caddyfile
{
    local_certs
}

dev.switch-test.localhost {
    tls internal
    reverse_proxy host.docker.internal:3057
}

prod.switch-test.localhost {
    tls internal
    reverse_proxy host.docker.internal:4057
}

dev.box-storage.localhost {
    tls internal
    reverse_proxy host.docker.internal:3058
}

prod.box-storage.localhost {
    tls internal
    reverse_proxy host.docker.internal:4058
}

dev.sst.localhost {
    tls internal
    reverse_proxy host.docker.internal:3059
}

prod.sst.localhost {
    tls internal
    reverse_proxy host.docker.internal:4059
}
```

Notes:

- `local_certs` ensures internal CA usage instead of ACME.
- `tls internal` generates certs from Caddy internal CA.
- Certs + CA are persisted under `/data`.

### 2) `infra/docker-compose.yml`

```yaml
services:
  caddy:
    image: caddy:alpine
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  caddy_data:
  caddy_config:
```

Notes:

- `caddy_data` must persist to keep CA stable.
- `extra_hosts` makes host routing work on Linux too.

### 3) `infra/setup-trust.sh`

```bash
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_FILE="$SCRIPT_DIR/caddy-root-ca.crt"

echo "==> Starting Caddy to generate internal CA..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d caddy
sleep 3

echo "==> Exporting root CA from Docker volume..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" \
  exec caddy cat /data/caddy/pki/authorities/local/root.crt > "$CERT_FILE"

echo "==> Root CA exported: $CERT_FILE"

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "==> Installing CA into macOS system keychain..."
  sudo security add-trusted-cert -d -r trustRoot \
    -k /Library/Keychains/System.keychain "$CERT_FILE"
  echo "==> Done."
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "==> Installing CA into Linux trust store..."
  sudo cp "$CERT_FILE" /usr/local/share/ca-certificates/caddy-root-ca.crt
  sudo update-ca-certificates
  echo "==> Done. Firefox may need manual import."
fi

echo ""
echo "For mobile devices in LAN:"
echo "  1) Transfer $CERT_FILE to device"
echo "  2) iOS: install profile + enable full trust"
echo "  3) Android: install as CA certificate"
```

### 4) `.gitignore` Addition

```gitignore
# Caddy SSL - machine specific
infra/caddy-root-ca.crt
```

### 5) `package.json` Script Updates

`apps/switch-test/package.json`:

```json
"start:prod": "PORT=4057 HOST=0.0.0.0 node .output/server/index.mjs"
```

`apps/box-storage/package.json`:

```json
"start:prod": "PORT=4058 HOST=0.0.0.0 node .output/server/index.mjs"
```

`apps/sst/package.json`:

```json
"start:prod": "PORT=4059 HOST=0.0.0.0 node .output/server/index.mjs"
```

Root `package.json`:

```json
"start:prod": "turbo run start:prod",
"update-prod": "git pull && bun install && bun run build"
```

## LAN Access via `sslip.io`

`*.localhost` only works on local machine.  
For mobile LAN access, add aliases:

```caddyfile
dev.sst.localhost, sst.192.168.1.100.sslip.io {
    tls internal
    reverse_proxy host.docker.internal:3059
}
```

Replace IP with current host LAN IP.

If IP changes:

1. Update `Caddyfile`
2. Restart Caddy (`docker compose restart caddy`)

## New Machine Setup Flow

```bash
# 1. Clone + install
git clone <repo-url> all-personal-projects
cd all-personal-projects
bun install

# 2. Start Caddy + trust CA
cd infra
docker compose up -d
chmod +x setup-trust.sh
./setup-trust.sh
cd ..

# 3. Start app dev server
bun run dev --filter=sst
# -> https://dev.sst.localhost
```

## Future App Onboarding

For each new app:

1. Add dev/prod domain blocks in Caddyfile.
2. Restart Caddy.
3. Add `start:prod` script in app `package.json`.

No manual certificate work is needed as long as internal CA remains trusted and stable.
