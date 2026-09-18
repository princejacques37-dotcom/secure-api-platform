output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "application_url" {
  value = var.domain_name != "" ? (var.acm_certificate_arn != "" ? "https://${var.domain_name}" : "http://${var.domain_name}") : (var.acm_certificate_arn != "" ? "https://${aws_lb.main.dns_name}" : "http://${aws_lb.main.dns_name}")
}

output "ecr_api_repository" {
  value = aws_ecr_repository.api.repository_url
}

output "ecr_frontend_repository" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "github_deploy_role_arn" {
  value = aws_iam_role.github_deploy.arn
}

output "database_endpoint" {
  value = aws_db_instance.main.address
}
