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
- Optional LAN access via two approaches:
  - `sslip.io` aliases
  - FRITZ!Box device hostname (for example `https://stefan:8449`)

## Files

- `infra/caddy/Caddyfile` – base domain routing and TLS config.
- `infra/caddy/Caddyfile.local` – generated machine-local routes (gitignored).
- `infra/docker-compose.yml` – Caddy container setup.
- `infra/setup-trust.sh` – generates local config, starts Caddy, exports/installs Caddy root CA.
- `infra/generate-caddy-local.sh` – generates machine-local Caddy routes from `infra/.env`.
- `infra/.env.example` – template for machine-local config.

## Port mapping

### App server ports (host)

| App         | Dev    | Prod   |
| ----------- | ------ | ------ |
| switch-test | `3057` | `4057` |
| box-storage | `3058` | `4058` |
| sst         | `3059` | `4059` |

Rule: `prod = dev + 1000`.

### FRITZ!Box hostname HTTPS ports (Caddy)

If `FRITZBOX_DEVICE_HOSTNAME` is set, Caddy exposes these LAN URLs:

| App         | Dev URL                   | Prod URL                  |
| ----------- | ------------------------- | ------------------------- |
| switch-test | `https://<hostname>:8447` | `https://<hostname>:9447` |
| box-storage | `https://<hostname>:8448` | `https://<hostname>:9448` |
| sst         | `https://<hostname>:8449` | `https://<hostname>:9449` |

Example with hostname `stefan`: `https://stefan:8449` (sst dev).

## Prerequisites

- Docker (with Compose support)
- Bun
- Local app dependencies installed (`bun install` at repo root)

## Machine-local config (`infra/.env`)

Use `infra/.env` for machine-specific settings.

```bash
cp infra/.env.example infra/.env
```

Set your FRITZ!Box device hostname:

```dotenv
FRITZBOX_DEVICE_HOSTNAME=stefan
```

Notes:

- `infra/.env` is gitignored and must never be committed.
- `infra/caddy/Caddyfile.local` is generated and also gitignored.

## Initial setup

Run from repository root:

```bash
bun install
cp infra/.env.example infra/.env
chmod +x infra/setup-trust.sh infra/generate-caddy-local.sh
./infra/setup-trust.sh
```

What happens:

1. Local Caddy routes are generated from `infra/.env`.
2. Caddy starts via Docker.
3. Caddy generates its internal root CA.
4. The CA is exported to `infra/caddy-root-ca.crt`.
5. The script installs the CA into your OS trust store.

## Start and stop Caddy

Start:

```bash
bash infra/generate-caddy-local.sh
docker compose -f infra/docker-compose.yml up -d
```

Restart after `Caddyfile`, `infra/.env`, or local routing changes:

```bash
bash infra/generate-caddy-local.sh
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

Open one of:

- `https://dev.sst.localhost`
- `https://<FRITZBOX_DEVICE_HOSTNAME>:8449` (if configured)

### Prod mode

Build all apps:

```bash
bun run build
```

Start prod servers:

```bash
bun run start:prod
```

Open one of:

- `https://prod.sst.localhost`
- `https://<FRITZBOX_DEVICE_HOSTNAME>:9449` (if configured)

## How to test the setup

### 1) TLS/domain test

Open one URL, for example:

- Desktop/local: `https://dev.sst.localhost`
- FRITZ!Box LAN: `https://stefan:8449`

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

### 3) LAN/mobile test (FRITZ!Box hostname)

1. Set `FRITZBOX_DEVICE_HOSTNAME` in `infra/.env`.
2. Run:

   ```bash
   bash infra/generate-caddy-local.sh
   docker compose -f infra/docker-compose.yml restart caddy
   ```

3. Transfer `infra/caddy-root-ca.crt` to the device.
4. Install/trust the CA certificate on the device.
5. Open `https://<hostname>:8449` (sst dev).

Expected:

- HTTPS works on the device without `sslip.io`.
- App can access microphone in secure context.

### 4) LAN/mobile test (`sslip.io`, optional alternative)

If you prefer `sslip.io`, add aliases in `infra/caddy/Caddyfile` and restart Caddy.

## Troubleshooting

- Certificate warning still shown:
  - Re-run `./infra/setup-trust.sh`.
  - Ensure you trust the installed root certificate.
- FRITZ!Box hostname URL does not open:
  - Verify the hostname resolves from your tablet/phone (for example `http://<hostname>:3012`).
  - Verify Caddy is running and restarted after regenerating local config.
  - Verify required Caddy LAN port is open (`8447-8449`, `9447-9449`).
- Domain resolves but app is unavailable:
  - Check that the target app server is running on the expected app port.
- CA changes unexpectedly:
  - Keep Docker volume `caddy_data` persistent.
