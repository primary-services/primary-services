variable "s3_deploy_bucket" {
  description = "Bucket to upload zip for deployment"
  type        = string 
}

variable "lambda_function_name" {
  description = "The lambda function name"
  type        = string
  default     = "public_api"
}

variable "vpc_subnet_ids" {
  description = "Private subnets from the VPC"
  type        = list
}

variable "vpc_security_group_ids" {
  description = "Security group ids from the VPC"
  type        = list
}