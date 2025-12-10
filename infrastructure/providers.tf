terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration cannot use variables because it's evaluated before
  # Terraform processes variables. Region must be hardcoded here.
  backend "s3" {
    bucket = "al-code-terraform-backend"
    key    = "my-profile/state-file"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}
