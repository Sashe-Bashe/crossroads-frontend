#!/usr/bin/env bash
# Download/validate first; replace tracked artifacts only after generation succeeds.
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

schema_path="openapi/openapi.json"
types_path="lib/generated/api.d.ts"
mode="fetch"
case "${1:-}" in
  --offline) mode="offline" ;;
  --check) mode="check" ;;
  --help|-h)
    printf '%s\n' 'Usage: bash scripts/fetch-openapi.sh [OPENAPI_URL|--offline|--check]'
    exit 0
    ;;
  --*) printf '%s\n' "Unknown option: $1" >&2; exit 2 ;;
esac
if (( $# > 1 )); then
  printf '%s\n' 'Expected at most one URL or mode argument.' >&2
  exit 2
fi
for executable in node_modules/.bin/openapi-typescript node_modules/.bin/prettier; do
  if [[ ! -x "$executable" ]]; then
    printf '%s\n' 'Dependencies are missing. Run npm ci in frontend first.' >&2
    exit 1
  fi
done

stage_dir="$(mktemp -d "$project_dir/.openapi-work.XXXXXX")"
trap 'rm -rf -- "$stage_dir"' EXIT

if [[ "$mode" == "fetch" ]]; then
  schema_url="${1:-${OPENAPI_URL:-http://127.0.0.1:8100/openapi.json}}"
  curl --fail --silent --show-error --location \
    --proto '=http,https' --proto-redir '=http,https' \
    --connect-timeout 10 --max-time 60 --retry 2 \
    --output "$stage_dir/openapi.json" -- "$schema_url"
else
  if [[ ! -f "$schema_path" ]]; then
    printf '%s\n' 'No schema snapshot exists. Start the API and run just fetch first.' >&2
    exit 1
  fi
  cp -- "$schema_path" "$stage_dir/openapi.json"
fi

node scripts/validate-openapi.mjs "$stage_dir/openapi.json"
node_modules/.bin/openapi-typescript "$stage_dir/openapi.json" \
  --output "$stage_dir/api.d.ts"
node_modules/.bin/prettier --parser typescript --stdin-filepath "$types_path" \
  < "$stage_dir/api.d.ts" > "$stage_dir/formatted-api.d.ts"
mv -- "$stage_dir/formatted-api.d.ts" "$stage_dir/api.d.ts"

if [[ "$mode" == "check" ]]; then
  if ! cmp -s -- "$types_path" "$stage_dir/api.d.ts"; then
    printf '%s\n' 'Generated API types are stale. Run just generate and commit the result.' >&2
    exit 1
  fi
  printf '%s\n' 'Generated API types match the committed OpenAPI snapshot.'
else
  mkdir -p openapi lib/generated
  if [[ "$mode" == "fetch" ]]; then
    mv -- "$stage_dir/openapi.json" "$schema_path"
  fi
  mv -- "$stage_dir/api.d.ts" "$types_path"
  printf '%s\n' "Updated $types_path using $schema_path."
fi
