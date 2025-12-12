# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-12

### Added
- Initial AWS infrastructure setup with S3, CloudFront, and Route53
- Terraform IaC for static website hosting
- GitHub Actions CI/CD pipeline for automatic deployment
- IAM OIDC integration for secure GitHub Actions authentication
- CloudFront origin access control and S3 bucket policies
- Automatic cache invalidation on deployments
- DNS management with Route53

### Resources
- **YouTube:** [Deploying AWS Static Site with Terraform & GitHub Actions (S3 + CloudFront)](https://youtu.be/_PsjMo0IemA)
  - Complete walkthrough of setting up production-ready static site hosting on AWS
  - Infrastructure as Code with Terraform
  - CI/CD automation with GitHub Actions

---

## Version History

| Version | Release Date | Description | Branch |
|---------|--------------|-------------|--------|
| 1.0.0   | 2025-12-12   | Initial release with AWS infrastructure | main |
