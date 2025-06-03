provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "vpc" {
  source  = "../../../modules/vpc"
}


