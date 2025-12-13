# My Profile

A personal profile website hosted on AWS using S3, CloudFront, and Route53. Infrastructure managed with Terraform and deployed via GitHub Actions.

## Current Version

| Version | Branch | Status | Description |
|---------|--------|--------|-------------|
| **v2.0.0** | `main` | Stable | Dual environment setup (prod + dev) |
| **v3.0.0** | `develop` | In Progress | Profile enhancement with a professional layout |

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes and YouTube videos.

## Architecture

- **S3** - Static website hosting
- **CloudFront** - CDN with HTTPS and caching
- **Route53** - DNS management with A and AAAA records
- **ACM** - SSL/TLS certificate (must be in us-east-1)
- **GitHub Actions** - CI/CD pipeline for automatic deployment
- **Environments** - Separate dev and prod environments

## Environments

This project supports two environments:

| Environment | Branch | Domain | Deployment |
|-------------|--------|--------|------------|
| **Production** | `main` | `my-profile.example.com` | Manual (tags only) |
| **Development** | `develop` | `my-profile-dev.example.com` | Auto on PR merge or Manual |

Each environment has its own:
- S3 bucket (named per environment)
- CloudFront distribution
- Route53 DNS records
- Terraform state (in separate workspaces if needed)

## Prerequisites

### 1. AWS Account Setup

Before deploying, you need to create the Terraform backend S3 bucket manually:

```bash
aws s3api create-bucket \
  --bucket example-terraform-backend \
  --region us-east-1

aws s3api put-bucket-versioning \
  --bucket example-terraform-backend \
  --versioning-configuration Status=Enabled
```

### 2. ACM Certificate

Create SSL certificates in **us-east-1** (required for CloudFront) for both environments:

```bash
# Certificate for both prod and dev (using wildcard or multiple SANs)
aws acm request-certificate \
  --domain-name my-profile.example.com \
  --subject-alternative-names my-profile-dev.example.com \
  --validation-method DNS \
  --region us-east-1
```

Alternatively, request separate certificates for each environment.

Validate the certificate using DNS records in Route53 and wait until status is `ISSUED`.

### 3. Route53 Hosted Zone

Ensure you have a hosted zone for your domain (`example.com`) in Route53.

### 4. GitHub OIDC Setup

Configure GitHub as an OpenID Connect (OIDC) identity provider in AWS to allow GitHub Actions to assume an IAM role without storing AWS credentials.

#### Step 1: Create OIDC Identity Provider

1. Go to **IAM → Identity Providers → Add provider**
2. Select **OpenID Connect**
3. Enter:
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
4. Click **Get thumbprint** and then **Add provider**

#### Step 2: Create IAM Role for GitHub Actions

1. Go to **IAM → Roles → Create role**
2. Select **Web identity**
3. Choose:
   - **Identity provider**: `token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
4. Click **Next** 
5. Name the role: `github-access-role`
6. After creating the role, **edit the trust policy** to add repository restrictions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:YOUR_GIT_USER_NAME/my-profile:*"
           }
         }
       }
     ]
   }
   ```

#### Step 3: Attach IAM Policy

1. In the `github-access-role`, go to **Permissions** tab
2. Click **Add permissions** → **Create inline policy**
3. Switch to **JSON** tab
4. Copy and paste the contents from `infrastructure/iam-policy.json`
5. Name the policy: `github-actions-terraform-policy`
6. Click **Create policy**

**Note**: The policy grants minimum required permissions for:
- S3 bucket management (website bucket + Terraform state bucket)
- CloudFront distribution and origin access control
- Route53 DNS record management
- ACM certificate read access
- IAM role management (for github-access-role if needed)

#### Resources

- [Configuring OpenID Connect in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS OIDC Identity Provider Setup](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [GitHub Actions AWS Authentication](https://github.com/aws-actions/configure-aws-credentials)
- [AWS Blog: Use IAM Roles with GitHub Actions](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/)

## Configuration

### Local Development

1. Create variables file:
   ```bash
    terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your certificate ARN:
   ```hcl
   certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
   domain_name = "example.com"
   ```

3. Initialize and apply Terraform:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### GitHub Actions Setup

Configure these secrets and variables in GitHub:

**Secrets** (Settings → Secrets → Actions):
- `AWS_OIDC_ROLE_ARN` - IAM role ARN for GitHub OIDC authentication
- `TF_VAR_CERTIFICATE_ARN` - ACM certificate ARN (us-east-1)
- `AWS_ACCOUNT_ID` - Your AWS Account ID (used for masking in workflow logs)

**Variables** (Settings → Variables → Actions):
- `TF_VAR_DOMAIN_NAME` - Your domain (e.g., `example.com`)

**Environments** (Settings → Environments):
Create two GitHub environments:
- `prod` - For production deployments (can add required reviewers)
- `dev` - For development deployments

The `profile_subdomain` defaults to `my-profile` and the `environment` variable is automatically set by the workflow based on the branch.

#### Security: AWS Account ID Masking

The workflow includes a step to mask your AWS Account ID from the GitHub Actions logs:

```yaml
- name: Mask AWS Account ID
  run: |
    echo "::add-mask::${{ secrets.AWS_ACCOUNT_ID }}"
```

This prevents accidental exposure of your AWS Account ID in workflow run logs. The masking is applied after configuring AWS credentials and before running Terraform commands.

## Infrastructure Components

### Terraform Files

- `main.tf` - S3 bucket, CloudFront distribution, OAC
- `route53.tf` - DNS A and AAAA records
- `variables.tf` - Input variables with defaults
- `outputs.tf` - Terraform outputs (bucket name, CloudFront ID, etc.)
- `providers.tf` - AWS provider and S3 backend configuration
- `iam-policy.json` - Minimum IAM permissions for deployment

### Cost Optimization

This infrastructure uses **AWS Free Tier** services:

- **S3**: 5GB storage free
- **CloudFront**: 1TB data transfer + 10M HTTPS requests/month free (always free)
- **Route53**: ~$0.50/month (hosted zone)
- **ACM**: Free
- **Total**: ~$0.50/month

**⚠️ Pricing Disclaimer**: The pricing information above reflects AWS pricing as of December 2025 when this project was created. AWS pricing may change over time, and actual costs depend on your usage patterns and account configuration. The author is not responsible for any costs incurred from deploying or running this infrastructure. Always verify current AWS pricing and monitor your usage through the AWS Billing Dashboard to avoid unexpected charges.

## Deployment

### Deployment Strategy

**Production** - Manual, tag-based deployments only:
- No automatic deployments
- Requires explicit version tags (e.g., `v2.0.0`)
- Provides audit trail and rollback capability

**Development** - Automatic deployments:
- Auto-deploys on push to `develop` branch
- Can also trigger manually

### Production Deployment (Manual)

**Prerequisites:**
1. Merge changes to `main` branch
2. Create and push a version tag:
   ```bash
   git checkout main
   git pull
   git tag v2.0.0
   git push origin v2.0.0
   ```

**Deploy:**
1. Go to **Actions** → **Production Infrastructure** → **Run workflow**
2. Configure:
   - **Branch**: Select any branch (workflow will checkout the tag)
   - **Tag**: `v2.0.0` (required)
   - **Job**: `deploy`
3. Click **Run workflow**

**What happens:**
1. **Validates** tag exists in repository (fails fast if not found)
2. Checks out the specific tag
3. Applies Terraform changes to production infrastructure
4. Syncs `app/src/` to production S3 bucket
5. Invalidates CloudFront cache
6. **Outputs deployment summary** with tag info

**Notes**: 
- If tag doesn't exist, workflow fails immediately with error listing available tags
- After deployment, view the workflow summary to see which tag was deployed
- Only production-related jobs are shown (no skipped dev jobs)

### Development Deployment

**Automatic** - Via Pull Request to `develop`:
```bash
# Create feature branch
git checkout -b feature/my-change
# Make changes and commit
git add .
git commit -m "Add new feature"
# Push feature branch
git push origin feature/my-change
```

1. Create a Pull Request targeting `develop` branch
2. Once PR is reviewed and merged, workflow automatically triggers deployment

**Note**: Direct pushes to `develop` are blocked by branch protection rules. All changes must go through pull requests.

**Manual** - Via GitHub Actions:
1. Go to **Actions** → **Development Infrastructure** → **Run workflow**
2. Configure:
   - **Tag**: (optional, leave empty to use develop branch)
   - **Job**: `deploy`
3. Click **Run workflow**

**Benefits of split workflows:**
- Only shows development-related jobs (no skipped prod jobs)
- Cleaner, simpler interface
- No environment selection needed

### Destroy Infrastructure

**Production:**
1. Go to **Actions** → **Production Infrastructure** → **Run workflow**
2. Configure:
   - **Tag**: version tag (e.g., `v2.0.0`)
   - **Job**: `destroy`

**Development:**
1. Go to **Actions** → **Development Infrastructure** → **Run workflow**
2. Configure:
   - **Tag**: (optional, leave empty)
   - **Job**: `destroy`

**⚠️ Warning**: Destroy operations are irreversible. They will:
- Run `terraform destroy` to tear down all infrastructure
- Delete S3 bucket and all contents
- Remove CloudFront distribution
- Remove Route53 records

**Note**: The S3 bucket has `force_destroy = true` enabled, which means the destroy operation will automatically delete all objects and versions in the bucket before removing it.

## Project Structure

```
my-profile/
├── .github/
│   └── workflows/
│       ├── terraform-prod.yml    # Production workflow
│       └── terraform-dev.yml     # Development workflow
├── app/
│   └── src/
│       └── index.html            # Website content
├── infrastructure/
│   ├── main.tf
│   ├── route53.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── providers.tf
│   ├── data.tf
│   ├── iam.tf
│   ├── iam-policy.json
│   └── terraform.tfvars.example
└── README.md
```

## IAM Permissions

The GitHub Actions workflow uses an IAM role that trusts GitHub's OIDC provider. This role should have the custom policy defined in `infrastructure/iam-policy.json` attached.

### Creating the Custom Policy

1. Go to **IAM → Policies → Create policy**
2. Select **JSON** tab
3. Paste the content from `infrastructure/iam-policy.json`
4. Name it: `GitHubActionsMyProfileDeployPolicy`
5. Create the policy

### Attaching to the GitHub Actions Role

1. Go to **IAM → Roles** → find your GitHub Actions role (created in Prerequisites)
2. Click **Add permissions → Attach policies**
3. Search for `GitHubActionsMyProfileDeployPolicy`
4. Attach the policy

### What the Policy Grants

The minimum IAM policy grants only necessary permissions for:

- **S3**: Create/manage specific buckets (`my-profile.example.com`, `my-profile-dev.example.com`, and terraform backend)
- **CloudFront**: Create/update distributions, OAC, and cache invalidations
- **Route53**: Manage DNS records in your hosted zone
- **ACM**: Read certificate details (required for CloudFront)
- **IAM/STS**: Read account ID (required for bucket policies)

**Security Note**: This policy is scoped to specific resources and actions, following the principle of least privilege. It does NOT grant full access like `AmazonS3FullAccess` or `CloudFrontFullAccess`.

## Manual Operations

### Sync files to S3 manually:
```bash
# Production
aws s3 sync ./app/src s3://my-profile.example.com/ --delete

# Development
aws s3 sync ./app/src s3://my-profile-dev.example.com/ --delete
```

### Invalidate CloudFront cache:
```bash
# Get distribution ID from terraform output first
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### View Terraform outputs:
```bash
cd infrastructure
terraform output
```

Available outputs:
- `cloudfront_domain_name` - CloudFront distribution domain (e.g., d111111abcdef8.cloudfront.net)
- `s3_bucket_name` - S3 bucket name (my-profile.example.com)
- `s3_bucket_arn` - S3 bucket ARN
- `cloudfront_distribution_id` - CloudFront distribution ID for cache invalidations
- `cloudfront_aliases` - Custom domain names configured in CloudFront
- `website_url` - Your website URL (https://my-profile.example.com)
- `s3_sync_command` - Ready-to-use command for syncing files to S3

## License

MIT