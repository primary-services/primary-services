data "aws_iam_policy_document" "rds_proxy_secrets" {
  statement {
    effect = "Allow"

    actions = [
       "secretsmanager:*"
    ]

    resources = ["*"]
  }
}