#!/bin/bash
set -e

# Step 1: Get the changeset status
yarn changeset status --since origin/main --output version.json

# Step 2: Extract newVersion from version.json
new_version=$(jq -r '.releases[0].newVersion' version.json)
echo "Found new version: $new_version"

# Step 3: Update the version in manifest.json
jq --arg version "$new_version" '.version = $version' packages/chrome-extension/public/manifest.json > tmp.json && mv tmp.json packages/chrome-extension/public/manifest.json
echo "Applied new version: $_new_version"

# Step 4: Clean up
yarn prettier -w packages/chrome-extension/public/manifest.json
rm version.json