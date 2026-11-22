#!/bin/bash
# post-edit-quality.sh — PostToolUse hook
# Runs Prettier, ESLint (Clean Code rules), and TypeScript check after TS edits.
# Exit 2 => stderr is fed back to Claude to self-correct.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

case "$FILE_PATH" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Skip if file was deleted
[ ! -f "$FILE_PATH" ] && exit 0

# Resolve git worktree root or fallback to project dir
ROOT=$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null)
[ -z "$ROOT" ] && ROOT="$CLAUDE_PROJECT_DIR"
cd "$ROOT" || exit 0

if [ ! -d node_modules ]; then
  echo "post-edit-quality: skipped — no node_modules in $ROOT" >&2
  exit 0
fi

# 1. Auto-format with Prettier silently
npx prettier --write "$FILE_PATH" >/dev/null 2>&1

# 2. Run ESLint (auto-fix safe issues, fail on max-lines, max-lines-per-function, no-explicit-any)
ESLINT_ERRORS=$(npx eslint --fix "$FILE_PATH" 2>&1)
ESLINT_EXIT=$?

if [ $ESLINT_EXIT -ne 0 ]; then
  echo "ESLint / Clean Code violations in $FILE_PATH (fix them according to SKILL.md):" >&2
  echo "$ESLINT_ERRORS" >&2
  exit 2
fi

# 3. Typecheck the project using a temp buildinfo cache to keep repo clean
CACHE_HASH=$(echo "$ROOT" | md5sum | cut -d' ' -f1)
TS_ERRORS=$(npx tsc --noEmit --incremental --tsBuildInfoFile "/tmp/tsc-$CACHE_HASH.tsbuildinfo" 2>&1)
TS_EXIT=$?

if [ $TS_EXIT -ne 0 ]; then
  echo "TypeScript compilation errors after editing $FILE_PATH — fix them:" >&2
  echo "$TS_ERRORS" >&2
  exit 2
fi

exit 0