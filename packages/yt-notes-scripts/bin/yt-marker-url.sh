#!/usr/bin/env bash
# yt-marker-url.sh — YouTube-Marker-URL aus Timestamp + Video-ID bauen.
#
# Single Source of Truth für die Konvertierung Timestamp → URL. Wird vom
# TS-Helper (src/utils/yt-marker.ts) gespiegelt; das Test-Set in
# yt-marker.test.ts hält beide Implementierungen synchron.
#
# Erlaubte Formate:
#   - M:SS         (z.B. 3:24)
#   - MM:SS        (z.B. 13:24)
#   - H:MM:SS      (z.B. 1:03:24)
#   - HH:MM:SS     (z.B. 12:03:24)
#
# Video-ID: exakt 11 Zeichen, Alphabet [A-Za-z0-9_-].

set -euo pipefail

print_help() {
  cat <<EOF
Usage: yt-marker-url.sh <timestamp> <video-id>

Wandelt einen YouTube-Timestamp (M:SS, MM:SS, H:MM:SS, HH:MM:SS) und eine
11-stellige Video-ID in eine YouTube-Marker-URL um.

Output (stdout):
  https://www.youtube.com/watch?v=<video-id>&t=<seconds>s

Exit-Codes:
  0  Erfolg (URL auf stdout) oder --help
  1  Validierungsfehler (Format Timestamp oder Video-ID)
  2  Falsche Argumentanzahl

Beispiele:
  yt-marker-url.sh 3:24 wv779vmyPVY
  yt-marker-url.sh 1:23:45 dQw4w9WgXcQ
EOF
}

if [[ $# -eq 1 && ( "$1" == "--help" || "$1" == "-h" ) ]]; then
  print_help
  exit 0
fi

if [[ $# -ne 2 ]]; then
  echo "Error: erwarte genau 2 Argumente: <timestamp> <video-id>" >&2
  print_help >&2
  exit 2
fi

ts="$1"
vid="$2"

# Video-ID validieren
if [[ ! "$vid" =~ ^[A-Za-z0-9_-]{11}$ ]]; then
  echo "Error: ungültige Video-ID '$vid' (erwarte 11 Zeichen [A-Za-z0-9_-])" >&2
  exit 1
fi

# Timestamp validieren + Sekunden berechnen
if [[ "$ts" =~ ^([0-9]{1,2}):([0-9]{2})$ ]]; then
  # M:SS oder MM:SS
  m="${BASH_REMATCH[1]}"
  s="${BASH_REMATCH[2]}"
  if (( 10#$s > 59 )); then
    echo "Error: Sekunden > 59 in '$ts'" >&2
    exit 1
  fi
  total=$(( 10#$m * 60 + 10#$s ))
elif [[ "$ts" =~ ^([0-9]{1,2}):([0-9]{2}):([0-9]{2})$ ]]; then
  # H:MM:SS oder HH:MM:SS
  h="${BASH_REMATCH[1]}"
  m="${BASH_REMATCH[2]}"
  s="${BASH_REMATCH[3]}"
  if (( 10#$m > 59 )); then
    echo "Error: Minuten > 59 in '$ts'" >&2
    exit 1
  fi
  if (( 10#$s > 59 )); then
    echo "Error: Sekunden > 59 in '$ts'" >&2
    exit 1
  fi
  total=$(( 10#$h * 3600 + 10#$m * 60 + 10#$s ))
else
  echo "Error: ungültiges Timestamp-Format '$ts' (erwarte M:SS, MM:SS, H:MM:SS oder HH:MM:SS)" >&2
  exit 1
fi

printf 'https://www.youtube.com/watch?v=%s&t=%ds\n' "$vid" "$total"
