#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/t/incubyte-assement/frontend
echo "=== test ==="
npm test
echo "=== lint ==="
npm run lint
echo "=== build ==="
npm run build
