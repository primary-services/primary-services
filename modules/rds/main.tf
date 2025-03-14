# module "vpc" {
#   source = "../vpc"
# }

resource "aws_db_instance" "ma_elections_db" {
    allocated_storage       = 20
    db_subnet_group_name    = var.vpc_subnet_group
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