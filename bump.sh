#!/bin/bash
# Refreshes the ?v= cache-busting tags on style.css and main.js across every page.
# The tag is a short hash of the file, so it only changes when the file does.
cd "$(dirname "$0")" || exit 1
css=$(md5 -q css/style.css | cut -c1-6)
js=$(md5 -q js/main.js | cut -c1-6)
for f in *.html memos/*.html; do
  sed -i '' -E "s/style\.css\?v=[A-Za-z0-9]+/style.css?v=$css/; s/main\.js\?v=[A-Za-z0-9]+/main.js?v=$js/" "$f"
done
echo "style.css?v=$css  main.js?v=$js"
