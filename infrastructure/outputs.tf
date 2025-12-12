output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.profile_distribution.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.profile_bucket.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.profile_bucket.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.profile_distribution.id
}

output "cloudfront_aliases" {
  description = "CloudFront alternate domain names"
  value       = aws_cloudfront_distribution.profile_distribution.aliases
}

output "website_url" {
  description = "Website URL"
  value       = var.environment == "prod" ? "https://${var.profile_subdomain}.${var.domain_name}" : "https://${var.profile_subdomain}-${var.environment}.${var.domain_name}"
}

output "s3_sync_command" {
  description = "Command to sync app to S3 bucket"
  value       = "aws s3 sync ./app/src s3://${aws_s3_bucket.profile_bucket.id}/"
}
