#!/bin/bash
set -e

# Read project configuration from per-app .vercel links
# These are created by: vercel link --cwd apps/api --project <name> --yes
API_LINK="./apps/api/.vercel/project.json"
WEB_LINK="./apps/web/.vercel/project.json"

if [ ! -f "$API_LINK" ]; then
  echo "Error: $API_LINK not found."
  echo "Run: vercel link --cwd apps/api --project <api-project-name> --yes"
  exit 1
fi

if [ ! -f "$WEB_LINK" ]; then
  echo "Error: $WEB_LINK not found."
  echo "Run: vercel link --cwd apps/web --project <web-project-name> --yes"
  exit 1
fi

API_PROJECT=$(node -p "require('$API_LINK').projectId")
WEB_PROJECT=$(node -p "require('$WEB_LINK').projectId")
ORG_ID=$(node -p "require('$API_LINK').orgId")

echo "==> Deploying API (project: $API_PROJECT)..."
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$API_PROJECT vercel deploy --prod --yes

echo ""
echo "==> Deploying Web (project: $WEB_PROJECT)..."
VERCEL_ORG_ID=$ORG_ID VERCEL_PROJECT_ID=$WEB_PROJECT vercel deploy --prod --yes

echo ""
echo "Done. Both apps deployed to production."
