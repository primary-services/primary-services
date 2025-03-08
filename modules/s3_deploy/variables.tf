variable "bucket_prefix" {
  description = "Prefix for the S3 bucket. Must be lower case and fewer than 38 characters in length."
  type        = string
  default     = "deployments"
}

variable "tags" {
  description = "Tags to set on the bucket."
  type        = map(string)
  default     = {}
}