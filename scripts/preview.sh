#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"

echo "[preview] Serving Otter Planet frontend"
echo "[preview] URL: http://localhost:${PORT}"
echo "[preview] Press Ctrl+C to stop"

python3 -m http.server "$PORT"
