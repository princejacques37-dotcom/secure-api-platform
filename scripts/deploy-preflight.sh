#!/usr/bin/env bash
set -euo pipefail

need_cmds=(git aws terraform docker)
missing=0
for cmd in "${need_cmds[@]}"; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "MISSING: $cmd"
    missing=1
  else
    echo "OK: $cmd -> $(command -v "$cmd")"
  fi
done

if [[ $missing -eq 1 ]]; then
  echo "Install the missing tools before continuing."
  exit 1
fi

echo
echo "AWS identity:"
aws sts get-caller-identity

echo
echo "Terraform:"
terraform version

echo
echo "Docker:"
docker version --format '{{.Server.Version}}' || docker version

echo
echo "Preflight complete."
