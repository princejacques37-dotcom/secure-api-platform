# Secure API Platform — Deployment Runbook

This runbook takes the project from the Git repository to AWS. It assumes the repository is hosted on GitHub and the AWS account is under your control.

## 1. Local prerequisites

Install and authenticate:

```bash
./scripts/deploy-preflight.sh
```

The script checks Git, AWS CLI, Terraform, and Docker and verifies the active AWS identity.

## 2. Configure Terraform

```bash
cd projects/secure-api-platform/infra/aws
cp terraform.tfvars.example terraform.tfvars
```

Set:

- `aws_region`
- `github_repository` in `OWNER/REPO` format
- `desired_count = 0` for the first apply
- optional custom domain / ACM / Route53 values

Do not commit `terraform.tfvars`.

## 3. Initialize and inspect infrastructure

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

The first apply intentionally creates the AWS control plane with zero ECS tasks so the placeholder images do not need to exist yet.

## 4. Configure GitHub Actions

Repository variables:

```text
AWS_REGION
ECR_API_REPOSITORY
ECR_FRONTEND_REPOSITORY
ECS_CLUSTER
ECS_SERVICE
```

Repository secret:

```text
AWS_DEPLOY_ROLE_ARN
```

The workflow authenticates using GitHub OIDC, so no long-lived AWS access key is required. The Terraform IAM trust policy is constrained to the configured repository and the `main` branch.

## 5. First image push

Push to `main` after the infrastructure exists. The workflow will:

1. run the security/quality workflow,
2. build the API image,
3. build the frontend image,
4. push immutable SHA-tagged images to ECR,
5. register a new ECS task definition,
6. update the ECS service,
7. wait for the service to stabilize.

After the first image build succeeds, set `desired_count = 1` and apply Terraform again to establish the intended steady state.

## 6. Verify deployment

Use Terraform outputs for the ALB DNS name and test:

```bash
curl -I http://<ALB-DNS>/
curl -i http://<ALB-DNS>/api/health
```

For a custom domain, use ACM + Route53 and run the HTTPS listener configuration already present in Terraform.

## 7. Security checks after launch

Confirm in AWS:

- ECS tasks have no public IPs.
- RDS is reachable only from the ECS security group.
- Secrets are injected from Secrets Manager rather than committed to the repository.
- CloudWatch logs are populated for both containers.
- WAF is associated with the ALB when enabled.
- GitHub Actions uses OIDC and the trust policy is repository/branch constrained.

AWS documents that Fargate task definitions can use the `awslogs` driver to ship container output to CloudWatch Logs, and ECS supports injecting Secrets Manager values into task containers. GitHub's OIDC model provides short-lived AWS access without storing long-lived AWS credentials in GitHub.
