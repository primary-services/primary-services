provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "deploy_bucket" {
  source = "../../modules/s3/deploy"
}

module "vpc" {
  source  = "../../modules/vpc"
}

module "rds" {
  source = "../../modules/rds"

  db_username = var.db_username
  db_password = var.db_password

  vpc_subnet_group = module.vpc.database_subnet_group
}

module "api" {
  source = "../../modules/lambdas/api"

  s3_deploy_bucket = module.deploy_bucket.name
  vpc_subnet_ids = module.vpc.vpc_private_subnets
  vpc_security_group_ids = [module.vpc.default_security_group_id]
}