resource "aws_iam_role" "cloudfront_s3_role" {
  name = "cloudfront-s3-access-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "cloudfront.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "s3_access_policy" {
  name        = "s3-bucket-access-policy-${var.environment}"
  description = "IAM policy for S3 bucket access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "s3:GetObject",
        "s3:ListBucket"
      ]
      Effect   = "Allow"
      Resource = [
        aws_s3_bucket.profile_bucket.arn,
        "${aws_s3_bucket.profile_bucket.arn}/*"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.cloudfront_s3_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}
