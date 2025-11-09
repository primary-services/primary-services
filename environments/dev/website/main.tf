provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "static-website" {
  source = "../../../modules/s3/static-website"

  bucket_name = "ma-elections-website"
  source_files = "../../../src/website/dist"
  aliases = ["deadlykitten.com", "www.deadlykitten.com", "mademocracy.com", "www.mademocracy.com"]
  
  # These are required when using a custom domain
  use_default_certificate = false
  certificate_arn = "arn:aws:acm:us-east-1:173549513063:certificate/8b19d368-ceb4-47b8-b6a7-a9da903dec22"
  certificate_minimum_protocol_version = "TLSv1.2_2021"
  certificate_ssl_support_method = "sni-only"
  profile = "elections"
}