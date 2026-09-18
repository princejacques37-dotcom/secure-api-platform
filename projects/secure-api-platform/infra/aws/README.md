# AWS production deployment

This directory provisions a portfolio-grade AWS environment for the Secure API Platform.

## Architecture

```text
Internet
   |
   v
Application Load Balancer (public subnets)
   |
   v
ECS Fargate task (private subnets)
   |-- Next.js frontend :3001
   |-- FastAPI API       :8000 (localhost only)
   |
   v
RDS PostgreSQL (private subnets, encrypted, forced SSL)

GitHub Actions -- OIDC --> AWS IAM deploy role --> ECR --> ECS
```

The ALB is the only inbound entry point to the application. The ECS task has no public IP. The database security group accepts PostgreSQL only from the ECS security group. RDS storage is encrypted and the parameter group forces SSL/TLS for client connections. ECS logs are sent to CloudWatch. WAF can be attached to the ALB. citeturn722377search9turn722377search3turn722377search1

GitHub Actions uses OIDC rather than storing long-lived AWS access keys. The trust policy is restricted to the configured repository's `main` branch. citeturn722377search0turn722377search8

## Important cost note

The default configuration uses one NAT Gateway to keep the lab/portfolio cost lower. A production HA deployment should consider one NAT Gateway per Availability Zone or VPC interface endpoints where appropriate.

The default RDS instance is intentionally small and `multi_az = false`. Increase it for a production-critical workload.

## 1. Provision AWS infrastructure

From `infra/aws`:

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars and set github_repository.
terraform init
terraform fmt -recursive
terraform validate
terraform apply
```

The first apply uses `desired_count = 0`, so ECS does not try to pull placeholder images before the first CI deployment.

## 2. Add GitHub variables/secrets

Create repository variables:

- `AWS_REGION` — same value as `aws_region`
- `ECR_API_REPOSITORY` — from `terraform output -raw ecr_api_repository`, using the repository name portion
- `ECR_FRONTEND_REPOSITORY` — from `terraform output -raw ecr_frontend_repository`, using the repository name portion
- `ECS_CLUSTER` — `terraform output -raw ecs_cluster_name`
- `ECS_SERVICE` — `terraform output -raw ecs_service_name`

Create repository secret:

- `AWS_DEPLOY_ROLE_ARN` — `terraform output -raw github_deploy_role_arn`

The deployment workflow is `.github/workflows/deploy-aws.yml`.

## 3. First deployment

Push the repository to GitHub and push to `main`. The workflow:

1. runs Python compilation/tests;
2. authenticates to AWS through OIDC;
3. builds the API and frontend images;
4. pushes immutable commit-tagged images to ECR;
5. registers a new ECS task definition;
6. updates the ECS service and waits for it to stabilize.

This follows the AWS/GitHub OIDC model described in the official guidance, avoiding long-lived AWS credentials in GitHub. citeturn722377search0

## 4. Enable HTTPS

For a real domain, obtain an ACM certificate in the same AWS region as the ALB and set:

```hcl
 domain_name         = "app.example.com"
 acm_certificate_arn = "arn:aws:acm:..."
 route53_zone_id     = "Z..."
```

The HTTP listener will redirect to HTTPS whenever a certificate ARN is supplied.

## 5. Post-deployment checks

After the service becomes healthy:

```bash
curl -I "$(terraform output -raw application_url)/"
curl "$(terraform output -raw application_url)/api/health"
```

The Next.js frontend proxies `/api/*` to the FastAPI sidecar over the ECS task's local network namespace. That means browsers do not need a separate public API origin or CORS configuration in production.

## 6. Harden further

For a stronger production deployment, add:

- ACM certificate + HTTPS only
- Route53 DNS
- RDS Multi-AZ
- two NAT gateways or VPC endpoints
- centralized alerting for ALB/ECS/RDS
- AWS Backup policy
- stricter GitHub environment protection rules
- container image vulnerability scanning beyond ECR on-push scanning
- infrastructure drift checks and `terraform plan` in CI
- automated secret rotation where appropriate

Never commit `terraform.tfvars`, `.env`, AWS keys, or generated Terraform state to the repository.
