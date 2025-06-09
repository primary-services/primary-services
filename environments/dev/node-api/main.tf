provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

data "terraform_remote_state" "deployment" {
  backend = "local"

  config = {
    path = "../deployments/terraform.tfstate"
  }
}

data "terraform_remote_state" "vpc" {
  backend = "local"

  config = {
    path = "../vpc/terraform.tfstate"
  }
}

module "node-api" {
  source = "../../../modules/lambdas/node-api"

  s3_deploy_bucket = data.terraform_remote_state.deployment.outputs.name
  vpc_subnet_ids = data.terraform_remote_state.vpc.outputs.vpc_private_subnets
  vpc_security_group_ids = [data.terraform_remote_state.vpc.outputs.default_security_group_id]

  db_creds_secret_name = "DevDBCredentials"

  aliases = ["api.deadlykitten.com"]
  use_default_certificate = false
  certificate_arn = "arn:aws:acm:us-east-1:173549513063:certificate/00b49dab-5581-4afc-a417-13a32b1380b4"
  certificate_minimum_protocol_version = "TLSv1.2_2021"
  certificate_ssl_support_method = "sni-only"
}