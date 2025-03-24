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

resource "aws_s3_object" "provision_source_files" {
  bucket = aws_s3_bucket.s3-static-website.id

  # webfiles/ is the Directory contains files to be uploaded to S3
  for_each = fileset("${var.source_files}/", "**/*.*")

  key          = each.value
  source       = "${var.source_files}/${each.value}"
  content_type = each.value
}

data "aws_s3_bucket" "selected_bucket" {
  bucket = var.s3_bucket_id
}

resource "aws_cloudfront_origin_access_control" "cf-s3-oac" {
  name                              = "CloudFront S3 OAC"
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

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.s3_bucket_id
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

  # restrictions {
  #   geo_restriction {
  #     restriction_type = "whitelist"
  #     locations        = ["IN", "US", "CA"]
  #   }
  # }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # tags = merge(var.common_tags, {
  #   Name = "${var.naming_prefix}-cloudfront"
  # })
}