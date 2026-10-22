#!/usr/bin/env bash
# Builds and packs the package, installing it in a temporary folder with the minimum `vue`
# version declared in `peerDependencies`, and runs the SSR check against the installed package.
# It checks the published files and that the package works with the minimum Vue version.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$(mktemp -d)"
trap 'rm -rf "$APP_DIR"' EXIT

cd "$ROOT_DIR"
# E.g. `^3.5.0` -> `3.5.0`
MIN_VUE_VERSION="$(node -p "require('./package.json').peerDependencies.vue.replace(/^[^0-9]*/, '')")"

npm run build
TARBALL="$(npm pack --silent --pack-destination "$APP_DIR")"
cp scripts/check-ssr.mjs "$APP_DIR"

cd "$APP_DIR"
echo '{ "name": "min-peer-check", "private": true, "type": "module" }' > package.json
npm install --no-audit --no-fund "./$TARBALL" "vue@$MIN_VUE_VERSION"
PACKAGE_DIR=node_modules/vue-skeleton-content-loader node check-ssr.mjs
