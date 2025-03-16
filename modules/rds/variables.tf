variable "db_username" {
  description = "Database administrator username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "vpc_subnet_ids" {
  description = "IDs of the database subnets"
  type        = list
}

variable "vpc_subnet_group" {
  description = "Subnet group name for VPC"
  type        = string
}

variable "vpc_security_group_ids" {
  description = "Security Group fo VPC"
  type        = list
}

variable "db_credentials_arm" {
  description = "The arn of the secret used for storing DB Creds"
  type        = string
}