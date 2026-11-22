#!/bin/bash
# post-edit-quality.sh — PostToolUse hook
# Runs Prettier, ESLint (Clean Code rules), and TypeScript check after TS edits.
# The repo holds independent packages (frontend/, backend/): every check runs
# in the package that owns the edited file, with that package's own config.
# Exit 2 => stderr is fed back to Claude to self-correct.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

case "$FILE_PATH" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Skip if file was deleted
[ ! -f "$FILE_PATH" ] && exit 0

# Resolve the owning package: the nearest parent directory with a package.json.
PACKAGE_DIR=$(cd "$(dirname "$FILE_PATH")" 2>/dev/null && pwd)
while [ -n "$PACKAGE_DIR" ] && [ "$PACKAGE_DIR" != "/" ] && [ ! -f "$PACKAGE_DIR/package.json" ]; do
  PACKAGE_DIR=$(dirname "$PACKAGE_DIR")
done

if [ -z "$PACKAGE_DIR" ] || [ ! -f "$PACKAGE_DIR/package.json" ]; then
  echo "post-edit-quality: skipped — no package.json above $FILE_PATH" >&2
  exit 0
fi

cd "$PACKAGE_DIR" || exit 0
PACKAGE_NAME=$(basename "$PACKAGE_DIR")

if [ ! -d node_modules ]; then
  echo "post-edit-quality: skipped — no node_modules in $PACKAGE_DIR (run pnpm install there)" >&2
  exit 0
fi

# 1. Auto-format with Prettier silently (uses the package's .prettierrc if any)
npx prettier --write "$FILE_PATH" >/dev/null 2>&1

# 2. Run ESLint (auto-fix safe issues, fail on max-lines, max-lines-per-function, no-explicit-any)
ESLINT_ERRORS=$(npx eslint --fix "$FILE_PATH" 2>&1)
ESLINT_EXIT=$?

if [ $ESLINT_EXIT -ne 0 ]; then
  echo "ESLint violations in $FILE_PATH ($PACKAGE_NAME; for backend/ fix them according to SKILL.md):" >&2
  echo "$ESLINT_ERRORS" >&2
  exit 2
fi

# 3. Typecheck the package using a temp buildinfo cache to keep repo clean
#    (cksum, unlike md5sum, exists on both macOS and Linux)
CACHE_HASH=$(echo "$PACKAGE_DIR" | cksum | cut -d' ' -f1)
TS_ERRORS=$(npx tsc --noEmit --incremental --tsBuildInfoFile "/tmp/tsc-$CACHE_HASH.tsbuildinfo" 2>&1)
TS_EXIT=$?

if [ $TS_EXIT -ne 0 ]; then
  echo "TypeScript compilation errors in $PACKAGE_NAME after editing $FILE_PATH — fix them:" >&2
  echo "$TS_ERRORS" >&2
  exit 2
fi

exit 0
