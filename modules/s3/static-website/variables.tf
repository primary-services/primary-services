variable "profile" {
  description = "AWS Profile used for deployment"
  type        = string
}

variable "bucket_name" {
  description = "Name of bucket"
  type        = string
}

variable "source_files" {
  description = "Location of the source files"
  type        = string
}

variable "aliases" {
  description = "List of custom domains to use for the cloudfront distribution"
  type        = list(string)
  default     = []
}

variable "use_default_certificate" {
  description = "Set to false if using a custom domain"
  type        = bool
  default     = true
}

variable "certificate_arn" {
  description = "The arn of a custom certificate you're using"
  type        = string
  default     = null
}

variable "certificate_minimum_protocol_version" {
  description = "The arn of a custom certificate you're using"
  type        = string
  default     = null
}

variable "certificate_ssl_support_method" {
  description = "The arn of a custom certificate you're using"
  type        = string
  default     = null
}