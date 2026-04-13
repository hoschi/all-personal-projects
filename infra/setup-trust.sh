#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_FILE="$SCRIPT_DIR/caddy-root-ca.crt"

echo "==> Generating machine-local Caddy config..."
bash "$SCRIPT_DIR/generate-caddy-local.sh"

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
else
  echo "==> Unsupported OS. Install $CERT_FILE manually in your trust store."
fi

echo ""
echo "For mobile devices in LAN:"
echo "  1) Transfer $CERT_FILE to device"
echo "  2) iOS: install profile + enable full trust"
echo "  3) Android: install as CA certificate"
