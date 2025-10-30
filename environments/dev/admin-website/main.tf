provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "static-website" {
  source = "../../../modules/s3/static-website"

  bucket_name = "ma-elections-admin"
  source_files = "../../../src/admin/build"
  aliases = ["admin.deadlykitten.com", "admin.mademocracy.com"]
  
  # These are required when using a custom domain
  use_default_certificate = false
  certificate_arn = "arn:aws:acm:us-east-1:173549513063:certificate/00b49dab-5581-4afc-a417-13a32b1380b4"
  certificate_minimum_protocol_version = "TLSv1.2_2021"
  certificate_ssl_support_method = "sni-only"

  profile = "elections"
}