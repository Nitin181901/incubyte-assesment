#!/usr/bin/env bash
set -euo pipefail
export PATH="/home/purp_69/.rbenv/shims:/home/purp_69/.rbenv/bin:$PATH"
cd "$(dirname "$0")/.."
echo "=== seed timing ==="
RESEED=1 bin/rails db:seed
echo "=== bench ==="
bin/rails runner script/bench_quality.rb
