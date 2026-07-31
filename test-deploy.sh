#!/bin/bash
# Dry run: Simulate rsync without making changes

LOCAL_FOLDER="$(dirname "$(readlink -f "$0")")/"
REMOTE_HOST="fastcomet"
REMOTE_PATH="crew.supacoda.de/"

echo "=== Testing rsync (dry run) ==="
rsync -avz --dry-run --checksum --itemize-changes --exclude='.git' --exclude='*.log' --exclude='node_modules/' "$LOCAL_FOLDER/" "$REMOTE_HOST:$REMOTE_PATH"
echo "=== Dry run complete ===" 
