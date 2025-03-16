data "aws_iam_policy_document" "vpc_endpoint_policy_default" {
  statement {
    actions = ["*"]
    effect  = "Allow"
    resources = [
      "*",
    ]
    # condition {
    #   test     = "StringEquals"
    #   variable = "aws:PrincipalAccount"
    #   values = [
    #     data.aws_caller_identity.current.account_id,
    #   ]
    # }
    # condition {
    #   test     = "StringEquals"
    #   variable = "aws:ResourceAccount"
    #   values = [
    #     data.aws_caller_identity.current.account_id,
    #   ]
    # }
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.5.1"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs                 = var.vpc_azs
  private_subnets     = var.vpc_private_subnets
  public_subnets      = var.vpc_public_subnets
  database_subnets    = var.vpc_db_subnets
  
  enable_nat_gateway  = var.vpc_enable_nat_gateway

  create_database_subnet_group           = true
  create_database_subnet_route_table     = true
  create_database_internet_gateway_route = true

  enable_dns_hostnames = true
  enable_dns_support   = true

  # database_dedicated_network_acl = true
  # database_inbound_acl_rules = var.database_inbound_acl_rules
  # database_outbound_acl_rules = var.database_outbound_acl_rules

  # public_dedicated_network_acl = true
  # public_inbound_acl_rules = var.public_inbound_acl_rules
  # public_outbound_acl_rules = var.public_outbound_acl_rules

  tags = var.vpc_tags
}

module "endpoints" {
  source = "terraform-aws-modules/vpc/aws//modules/vpc-endpoints"

  vpc_id             = module.vpc.vpc_id
  security_group_ids = [module.vpc.default_security_group_id]

  endpoints = {
    secrets = {
      service             = "secretsmanager"
      policy              = data.aws_iam_policy_document.vpc_endpoint_policy_default.json
      private_dns_enabled = true
      subnet_ids          = module.vpc.private_subnets
    }
  }
}

# resource "aws_db_subnet_group" "db_subn" {
#   name       = "db_private_subnets"
#   subnet_ids = module.vpc.vpc_private_subnets

#   tags = {
#     Name = "My DB subnet group"
#   }
# }

module "rds_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.1.0"

  name        = "rds-sg"
  description = "Security Group for RDS access"
  
  create_sg          = false
  vpc_id             = module.vpc.vpc_id
  security_group_id  = module.vpc.default_security_group_id
  

  # Ingress Rules
  ingress_rules = ["all-all"]

  # CIDR Blocks for Ingress
  ingress_cidr_blocks = ["0.0.0.0/0"] # Allow access from all IP addresses. Adjust as needed.

  # Egress Rule - all-all open
  egress_rules = ["all-all"]
}