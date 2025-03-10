resource "aws_s3_bucket" "deploy_bucket" {
  bucket = "ma-election-services-deployments"
}

resource "aws_s3_bucket_ownership_controls" "deploy_bucket" {
  bucket = aws_s3_bucket.deploy_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}