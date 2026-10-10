set shell := ["bash", "-euo", "pipefail", "-c"]
set positional-arguments

# Show the available development recipes.
default:
    @just --list

# Fetch the backend OpenAPI document and generate the typed frontend client contract.
# An omitted URL uses OPENAPI_URL or http://127.0.0.1:8100/openapi.json.
fetch url="":
    bash scripts/fetch-openapi.sh "$1"

# Regenerate types from the committed snapshot without contacting the backend.
generate:
    bash scripts/fetch-openapi.sh --offline

# Fail when generated types are stale; no backend or writes required.
check-api:
    bash scripts/fetch-openapi.sh --check
