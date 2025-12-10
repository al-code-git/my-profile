variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy resources into"
}

variable "domain_name" {
  type        = string
  default     = "example.com"
  description = "Root domain name"
}

variable "profile_subdomain" {
  type        = string
  default     = "my-profile"
  description = "Profile subdomain (e.g., my-profile.example.com)"
}

variable "certificate_id" {
  type        = string
  default     = ""
  description = "ACM certificate ARN for CloudFront. Set via environment variable TF_VAR_certificate_id or terraform.tfvars. Certificate must be in us-east-1 for CloudFront."
}