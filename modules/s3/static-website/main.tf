resource "aws_s3_bucket" "s3-static-website" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "static_site_bucket_public_access" {
  bucket = aws_s3_bucket.s3-static-website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "static_site_bucket_website_config" {
  bucket = aws_s3_bucket.s3-static-website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

locals {
  content_types = {
    css  = "text/css"
    html = "text/html"
    js   = "application/javascript"
    json = "application/json"
    txt  = "text/plain"
  }
}

resource "aws_s3_object" "provision_source_files" {
  bucket = aws_s3_bucket.s3-static-website.id

  # webfiles/ is the Directory contains files to be uploaded to S3
  for_each = fileset("${var.source_files}/", "**/*.*")

  key          = each.value
  source       = "${var.source_files}/${each.value}"
  etag         = filemd5("${var.source_files}/${each.value}")
  content_type = lookup(local.content_types, element(split(".", each.value), length(split(".", each.value)) - 1), "text/plain")
  content_encoding = "utf-8"
}

data "aws_s3_bucket" "selected_bucket" {
  bucket = aws_s3_bucket.s3-static-website.id
}

resource "aws_cloudfront_origin_access_control" "cf-s3-oac" {
  name                              = "${aws_s3_bucket.s3-static-website.bucket} CloudFront S3 OAC"
  description                       = "CloudFront S3 OAC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cf-dist" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.s3-static-website.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.s3-static-website.id
    origin_access_control_id = aws_cloudfront_origin_access_control.cf-s3-oac.id
  }

  aliases = var.aliases

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.s3-static-website.id
    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["IN", "US", "CA"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_default_certificate
    acm_certificate_arn = var.certificate_arn
    minimum_protocol_version = var.certificate_minimum_protocol_version
    ssl_support_method = var.certificate_ssl_support_method
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
 
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  # tags = merge(var.common_tags, {
  #   Name = "${var.naming_prefix}-cloudfront"
  # })
}

data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3-static-website.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cf-dist.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "static_site_bucket_policy" {
  bucket = aws_s3_bucket.s3-static-website.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

resource "null_resource" "invalidate_cf_cache" {
  provisioner "local-exec" {
    command = "AWS_PROFILE=${var.profile} aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.cf-dist.id} --paths '/*'"
  }
  triggers = {
    always_run = timestamp()
  }
}