output "vpc_public_subnets" {
  description = "IDs of the VPC's public subnets"
  value       = module.vpc.public_subnets
}

output "vpc_private_subnets" {
  description = "IDs of the VPC's public subnets"
  value       = module.vpc.private_subnets
}

output "database_subnet_group" {
  description = "IDs of the VPC's database subnets"
  value       = module.vpc.database_subnet_group
}

output "default_security_group_id" {
  description = "ID of the VPC's Security Group"
  value       = module.vpc.default_security_group_id
}