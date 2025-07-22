variable "region" {
  description = "The aws region"
  type        = string
  default     = "us-east-2"
}

variable aliases {
  description = "The custom domain names"
  type        = list(string)
  default     = []
}

variable "s3_deploy_bucket" {
  description = "Bucket to upload zip for deployment"
  type        = string 
}

variable "lambda_function_name" {
  description = "The lambda function name"
  type        = string
  default     = "node_api"
}

variable "vpc_subnet_ids" {
  description = "Private subnets from the VPC"
  type        = list
}

variable "vpc_security_group_ids" {
  description = "Security group ids from the VPC"
  type        = list
}

variable "db_creds_secret_name" {
  description = "The DB Credentials Secret Name"
  type        = string
}

variable "jwt_temp_secret" {
  description = "The DB Credentials Secret Name"
  type        = string
}

# For custom domain setup
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