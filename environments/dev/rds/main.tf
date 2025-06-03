provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

data "terraform_remote_state" "vpc" {
  backend = "local"

  config = {
    path = "../vpc/terraform.tfstate"
  }
}

module "rds" {
  source = "../../../modules/rds"

  db_username = var.db_username
  db_password = var.db_password 

  db_credentials_arm = "arn:aws:secretsmanager:us-east-2:173549513063:secret:DevDBProxyCredentials-Z5zSl4"

  vpc_subnet_ids = data.terraform_remote_state.vpc.outputs.database_subnet_group_ids
  vpc_subnet_group = data.terraform_remote_state.vpc.outputs.database_subnet_group

  vpc_security_group_ids = [data.terraform_remote_state.vpc.outputs.database_security_group_id]
}

