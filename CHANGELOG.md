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

## [2.0.0] - 2025-12-12

### Changed
- **Production deployments**: Changed to manual tag-based deployments only (no automatic push triggers).
- **Development deployments**: Remains automatic on push to `develop` branch.
- GitHub Actions: added `tag` input for selecting which git tag to deploy to production.
- **Tag validation**: Added validation job that verifies tag exists before deployment starts.
- **Deployment summary**: Workflow outputs deployed tag in summary for easy reference in destroy operations.

### Added
- Pre-deployment validation job that checks if specified tag exists in repository.
- Helpful error messages showing available tags when validation fails.
- Deployment summary with tag used, environment, and destroy instructions.

### Usage

**Production (manual only)**:
- Trigger via GitHub Actions → Terraform Infrastructure → Run workflow
  - Set `Environment`: `prod`
  - Set `Tag`: version tag (e.g., `v2.0.0`) - **required**
  - Set `Job`: `deploy` or `destroy`
- Workflow validates tag exists before deployment
- After deployment, check workflow summary for tag and destroy instructions

**Development (automatic)**:
- Push to `develop` branch automatically deploys
- Can also trigger manually with `Environment`: `dev`
- Tag field not required for dev deployments

---

## Version History

| Version | Release Date | Description | Branch |
|---------|--------------|-------------|--------|
| 2.0.0   | 2025-12-12   | Tag triggers and manual ref selection for CI/CD | develop |
