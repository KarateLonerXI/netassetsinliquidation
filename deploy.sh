#!/bin/bash
# Usage: ./deploy.sh "what you changed"
# Refreshes cache tags, shows what changed, commits, and pushes (GitHub Pages republishes in ~1 min).
cd "$(dirname "$0")" || exit 1
msg="${1:-Update site}"
./bump.sh
git add -A
if git diff --cached --quiet; then echo "Nothing to deploy."; exit 0; fi
git status --short
read -r -p "Commit and push these to the live site? [y/N] " ok
[ "$ok" = "y" ] || { echo "Cancelled (changes are staged, not pushed)."; exit 1; }
git commit -q -m "$msg" && git push && echo "Pushed. Live in about a minute."
