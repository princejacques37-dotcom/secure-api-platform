#!/usr/bin/env bash
set -euo pipefail

OWNER_REPO="${1:-}"
DEFAULT_BRANCH="${2:-main}"

if [[ -z "$OWNER_REPO" ]]; then
  echo "Usage: $0 OWNER/REPO [branch]"
  exit 2
fi

if ! command -v git >/dev/null 2>&1; then
  echo "git is required." >&2
  exit 1
fi

REMOTE="https://github.com/${OWNER_REPO}.git"

if [[ ! -d .git ]]; then
  git init
fi

git checkout -B "$DEFAULT_BRANCH"
git add .

git diff --cached --quiet || git commit -m "Initial secure full-stack portfolio and DevSecOps project"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

git push -u origin "$DEFAULT_BRANCH"

echo
cat <<NEXT
Repository pushed successfully.

Next GitHub configuration:
  Repository secret: AWS_DEPLOY_ROLE_ARN
  Repository vars:
    AWS_REGION
    ECR_API_REPOSITORY
    ECR_FRONTEND_REPOSITORY
    ECS_CLUSTER
    ECS_SERVICE

Use infra/aws/DEPLOYMENT.md for the AWS bootstrap sequence.
NEXT
