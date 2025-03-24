provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "statis-website" {
  source = "../../../modules/s3/static-website"

  bucket_name = "elections-admin-front"
  source_files = "../../../modules/s3/admin/src/build"
}