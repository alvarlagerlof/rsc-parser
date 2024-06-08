#!/bin/bash
set -e

# Step 1: Extract newVersion from ./packages/core/package.json
new_version=$(jq -r '.version' ./packages/core/package.json)
echo "Found new version: $new_version"

# Step 2: Update the version in manifest.json
jq --arg version "$new_version" '.version = $version' packages/chrome-extension/public/manifest.json > tmp.json && mv tmp.json packages/chrome-extension/public/manifest.json
echo "Applied new version: $_new_version"

# Step 3: Clean up
yarn prettier -w packages/chrome-extension/public/manifest.json