#!/bin/bash
# pre-edit-guard.sh — PreToolUse hook
# Protects sensitive/generated files and enforces kebab-case naming in src/.
# Exit 2 => blocks the tool call and sends stderr back to Claude.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[ -z "$FILE_PATH" ] && exit 0

BASENAME=$(basename "$FILE_PATH")

# 1. Allow safe template/config files explicitly
case "$BASENAME" in
  .env.example|.env.template) exit 0 ;;
esac

# 2. Block protected path patterns
PROTECTED_PATTERNS=(".env" "package-lock.json" "pnpm-lock.yaml" "yarn.lock" ".git/" "/dist/" "/.next/" "/node_modules/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "BLOCKED: '$FILE_PATH' matches protected pattern '$pattern'." >&2
    exit 2
  fi
done

# 3. Enforce kebab-case filenames inside src/ (e.g., token-metrics.service.ts)
if [[ "$FILE_PATH" == *"/src/"* ]] && [[ "$BASENAME" != "main.ts" ]]; then
  if ! [[ "$BASENAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+)+$ ]]; then
    echo "BLOCKED: Invalid filename '$BASENAME'. Files in src/ must use kebab-case with role suffixes (e.g., 'daily-volume.service.ts')." >&2
    exit 2
  fi
fi

exit 0
