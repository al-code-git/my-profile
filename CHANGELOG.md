# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version History

| Version | Release Date | Description | Branch |
|---------|--------------|-------------|--------|
| 3.0.0   | 2025-12-22   | AI-powered profile layout redesign | main |
| 2.0.0   | 2025-12-12   | Dual environment setup (prod + dev) | main |
| 1.0.0   | 2025-12-12   | Initial release with AWS infrastructure | main |

---

## [3.0.0] - 2025-12-22

### Added
- **AI-Powered Layout Redesign**: Complete modernization of profile page layout with improved visual hierarchy
- **Bootstrap 5 Integration**: Professional responsive design framework for better mobile and desktop experience
- **Enhanced Navigation**: Sticky navbar with smooth scroll navigation to different sections (About, Skills, Experience, Certifications, Languages, Contact)
- **Modern Typography**: Improved font styling and text hierarchy for better readability
- **Technology Icons**: Integration of Devicon for professional technology stack visualization
- **Interactive Elements**: Smooth scrolling, active navigation indicators, and improved user interactions

### Resources
- **YouTube:** [Profile Layout Redesign - AI Powered](https://youtu.be/fFuagNT542M)
  - Complete walkthrough of the new modern profile layout
  - Bootstrap 5 responsive design implementation
  - Interactive navigation and smooth scrolling

---

## [2.0.0] - 2025-12-12

### Changed
- **Workflows split**: Separated into `terraform-prod.yml` and `terraform-dev.yml` for cleaner UI
- **Production deployments**: Manual tag-based deployments only (no automatic push triggers)
- **Development deployments**: Automatic on push to `develop` branch
- **Tag validation**: Production workflow validates tag exists before deployment starts
- **Deployment summary**: Workflow outputs deployed tag in summary for easy reference

### Added
- `terraform-prod.yml` - Production-only workflow (validate-tag, deploy, destroy)
- `terraform-dev.yml` - Development-only workflow (deploy, destroy, auto-trigger)
- Pre-deployment validation job that checks if specified tag exists in repository
- Helpful error messages showing available tags when validation fails
- Deployment summary with tag used and environment info

### Removed
- `terraform-ci.yml` - Replaced by separate prod/dev workflows

### Benefits
- **Cleaner UI**: Only shows relevant jobs for selected environment (no skipped jobs)
- **Better organization**: Each environment has its own workflow file
- **Simplified inputs**: Production requires tag, development doesn't

### Resources
- **YouTube:** [Dual Environment Setup - Production & Development](https://youtu.be/Rux2IxqZIy8)
  - Setting up separate prod and dev environments
  - Terraform workflow organization
  - GitHub Actions CI/CD for dual environments

### Usage

**Production (manual only)**:
- Go to Actions → **Production Infrastructure** → Run workflow
  - Set `Tag`: version tag (e.g., `v2.0.0`) - **required**
  - Set `Job`: `deploy` or `destroy`
- Workflow validates tag exists before deployment
- After deployment, check workflow summary for tag info

**Development (automatic)**:
- Push to `develop` branch automatically deploys
- Or trigger manually: Actions → **Development Infrastructure** → Run workflow
  - Set `Tag`: (optional, defaults to develop branch)
  - Set `Job`: `deploy` or `destroy`

---

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
- **YouTube:** [Deploying AWS Static Site with Terraform & GitHub Actions](https://youtu.be/_PsjMo0IemA)
  - Complete walkthrough of setting up production-ready static site hosting on AWS
  - Infrastructure as Code with Terraform
  - CI/CD automation with GitHub Actions
