# module "vpc" {
#   source = "../vpc"
# }

resource "aws_db_instance" "ma_elections_db" {
    allocated_storage       = 20
    db_subnet_group_name    = var.vpc_subnet_group
    vpc_security_group_ids  = var.vpc_security_group_ids
    engine                  = "postgres"
    engine_version          = "16.8"
    identifier              = "ma-elections-postgres-db"
    instance_class          = "db.t4g.micro"
    username                = var.db_username
    password                = var.db_password
    skip_final_snapshot     = true
    storage_encrypted       = false
    publicly_accessible     = true
    apply_immediately       = true
}

resource "aws_iam_policy" "rds_proxy_secrets" {
  name        = "rds_proxy_secrets"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.rds_proxy_secrets.json
}

resource "aws_db_proxy" "lambda_proxy" {
  name                   = "elections-db-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_policy.rds_proxy_secrets.arn
  vpc_security_group_ids = var.vpc_security_group_ids
  vpc_subnet_ids         = var.vpc_subnet_ids

  auth {
    auth_scheme = "SECRETS"
    description = "example"
    iam_auth    = "DISABLED"
    secret_arn  = var.db_credentials_arm
  }

  tags = {
    Name = "example"
    Key  = "value"
  }
}