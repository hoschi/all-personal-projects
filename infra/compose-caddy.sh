#!/bin/bash
# Run docker compose for Caddy, including docker-compose.override.yml when present.
# Plain `docker compose -f infra/docker-compose.yml` does not load that override.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

files=(-f infra/docker-compose.yml)
if [[ -f infra/docker-compose.override.yml ]]; then
  files+=(-f infra/docker-compose.override.yml)
fi

exec docker compose "${files[@]}" "$@"
