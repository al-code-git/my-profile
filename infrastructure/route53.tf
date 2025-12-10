# Get the existing Route53 hosted zone for example.com
data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

# A record for my-profile.example.com pointing to CloudFront
resource "aws_route53_record" "profile" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${var.profile_subdomain}.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.profile_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.profile_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA record (IPv6) for my-profile.example.com pointing to CloudFront
resource "aws_route53_record" "profile_ipv6" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${var.profile_subdomain}.${var.domain_name}"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.profile_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.profile_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
