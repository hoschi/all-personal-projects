# Local SSL Infrastructure (Caddy + Docker)

This folder contains the local HTTPS setup for the monorepo apps.

It enables secure browser contexts for features like microphone access (`getUserMedia`) by routing local app servers through Caddy with `tls internal`.

## What this infrastructure provides

- HTTPS domains for local development:
  - `https://dev.switch-test.localhost`
  - `https://dev.box-storage.localhost`
  - `https://dev.sst.localhost`
- HTTPS domains for local production builds:
  - `https://prod.switch-test.localhost`
  - `https://prod.box-storage.localhost`
  - `https://prod.sst.localhost`
- Optional LAN aliases via `sslip.io` (for tablet/mobile testing).

## Files

- `infra/caddy/Caddyfile` – domain routing and TLS config.
- `infra/docker-compose.yml` – Caddy container setup.
- `infra/setup-trust.sh` – exports and installs Caddy root CA into the OS trust store.

## Port mapping

| App | Dev | Prod |
| --- | --- | --- |
| switch-test | `3057` | `4057` |
| box-storage | `3058` | `4058` |
| sst | `3059` | `4059` |

Rule: `prod = dev + 1000`.

## Prerequisites

- Docker (with Compose support)
- Bun
- Local app dependencies installed (`bun install` at repo root)

## Initial setup

Run from repository root:

```bash
bun install
chmod +x infra/setup-trust.sh
./infra/setup-trust.sh
```

What happens:

1. Caddy starts via Docker.
2. Caddy generates its internal root CA.
3. The CA is exported to `infra/caddy-root-ca.crt`.
4. The script installs the CA into your OS trust store.

## Start and stop Caddy

Start:

```bash
docker compose -f infra/docker-compose.yml up -d
```

Restart after `Caddyfile` changes:

```bash
docker compose -f infra/docker-compose.yml restart caddy
```

Stop:

```bash
docker compose -f infra/docker-compose.yml down
```

## Run apps behind HTTPS

### Dev mode

Start one app (example `sst`):

```bash
bun run dev --filter=@repo/sst
```

Open:

- `https://dev.sst.localhost`

### Prod mode

Build all apps:

```bash
bun run build
```

Start prod servers:

```bash
bun run start:prod
```

Open:

- `https://prod.sst.localhost`

## How to test the setup

### 1) TLS/domain test

Open one of the domains, e.g. `https://dev.sst.localhost`.

Expected:

- Browser shows a valid HTTPS connection.
- No certificate warning page.

### 2) Functional app test

For `sst`:

1. Start recording.
2. Stop recording.
3. Use `Improve Text`.
4. Optionally open `Debug` panel.

Expected:

- Microphone access prompt appears and works.
- No insecure context error.
- Improve flow completes successfully.

### 3) LAN/mobile test (optional)

In `infra/caddy/Caddyfile`, add aliases (replace with your host LAN IP):

```caddy
# Example
sst.192.168.1.100.sslip.io {
  tls internal
  reverse_proxy host.docker.internal:3059
}
```

Then:

1. Restart Caddy.
2. Transfer `infra/caddy-root-ca.crt` to the device.
3. Install/trust it on the device.
4. Open `https://sst.<LAN-IP>.sslip.io`.

Expected:

- HTTPS works on the device.
- App can access microphone in secure context.

## Troubleshooting

- Certificate warning still shown:
  - Re-run `./infra/setup-trust.sh`.
  - Ensure you trust the installed root certificate.
- Domain resolves but app is unavailable:
  - Check that the target app server is running on the expected port.
- LAN alias does not work:
  - Verify the current host LAN IP in the alias.
  - Restart Caddy after changes.
- CA changes unexpectedly:
  - Keep Docker volume `caddy_data` persistent.
