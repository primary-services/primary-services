provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "ses" {
  source = "../../../modules/ses"
  domain = "deadlykitten.com"
}

