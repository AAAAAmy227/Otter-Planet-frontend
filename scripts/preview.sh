#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"

echo "[preview] Building Otter Planet frontend"
npm run build

echo "[preview] Starting Vite preview server"
exec npx vite preview
