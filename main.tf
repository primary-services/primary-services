# Terraform configuration

provider "aws" {
  region = "us-east-1"
  profile = "elections"
}

# module "vpc" {
#   source  = "terraform-aws-modules/vpc/aws"
#   version = "5.5.1"

#   name = var.vpc_name
#   cidr = var.vpc_cidr

#   azs             = var.vpc_azs
#   private_subnets = var.vpc_private_subnets
#   public_subnets  = var.vpc_public_subnets

#   enable_nat_gateway = var.vpc_enable_nat_gateway

#   tags = var.vpc_tags
# }

module "public_api" {
  source = "./modules/api"
}