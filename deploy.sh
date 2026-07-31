#!/bin/bash
# Deploy local folder to fastcomet (optimized for speed)

LOCAL_FOLDER="$(dirname "$(readlink -f "$0")")/"
REMOTE_HOST="fastcomet"
REMOTE_PATH="crew.supacoda.de/"

echo "=== Starting deployment ==="
rsync -avz --checksum --exclude='.git' --exclude='*.log' --exclude='node_modules/' "$LOCAL_FOLDER/" "$REMOTE_HOST:$REMOTE_PATH"
echo "=== Deployment complete ==="
