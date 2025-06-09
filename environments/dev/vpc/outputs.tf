output "vpc_public_subnets" {
  description = "IDs of the VPC's public subnets"
  value       = module.vpc.vpc_public_subnets
}

output "vpc_private_subnets" {
  description = "IDs of the VPC's private subnets"
  value       = module.vpc.vpc_private_subnets
}

output "database_subnet_group_ids" {
  description = "IDs of the VPC's database subnets"
  value       = module.vpc.database_subnet_group_ids
}

output "database_subnet_group" {
  description = "Name of the VPC's database subnets"
  value       = module.vpc.database_subnet_group 
}

output "database_security_group_id" {
  description = "ID for the database security group"
  # value       = module.rds_sg.security_group_id
  value       = module.vpc.database_security_group_id
}

output "default_security_group_id" {
  description = "ID of the VPC's Security Group"
  value       = module.vpc.default_security_group_id
}