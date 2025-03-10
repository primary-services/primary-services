provider "aws" {
  region = "us-east-2"
  profile = "elections"
}

module "dev" {
  source = "./environments/dev"

  db_username = var.db_username
  db_password = var.db_password
}