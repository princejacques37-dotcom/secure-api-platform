variable "aws_region" {
  description = "AWS region for the deployment."
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  type    = string
  default = "secure-api-platform"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "vpc_cidr" {
  type    = string
  default = "10.30.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["eu-west-1a", "eu-west-1b"]
}

variable "domain_name" {
  description = "Optional public domain name. Leave empty to use the ALB DNS name."
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN for HTTPS on the ALB."
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Optional Route53 hosted zone ID for creating the application DNS record."
  type        = string
  default     = ""
}

variable "github_repository" {
  description = "GitHub repository in OWNER/REPO format used by the deployment OIDC trust policy."
  type        = string
}

variable "desired_count" {
  description = "ECS desired task count. Start at 0 for the first Terraform apply before the first ECR image is pushed."
  type        = number
  default     = 0
}

variable "fargate_cpu" {
  type    = number
  default = 1024
}

variable "fargate_memory" {
  type    = number
  default = 2048
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "db_name" {
  type    = string
  default = "secure_api"
}

variable "db_username" {
  type    = string
  default = "app"
}

variable "db_multi_az" {
  type    = bool
  default = false
}

variable "deletion_protection" {
  description = "Enable RDS deletion protection once the environment is considered production-critical."
  type        = bool
  default     = false
}

variable "enable_waf" {
  description = "Associate AWS WAF with the public ALB."
  type        = bool
  default     = true
}
