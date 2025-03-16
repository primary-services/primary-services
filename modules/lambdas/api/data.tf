data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

data "aws_iam_policy_document" "lambda_secrets" {
  statement {
    effect = "Allow"

    actions = [
       "secretsmanager:*"
    ]

    resources = ["*"]
  }
}

data "aws_iam_policy_document" "rds" {
  statement {
    effect = "Allow"

    actions = [
       "rds-db:connect"
    ]

    resources = ["*"]
  }
}

data "aws_iam_policy_document" "ec2" {
  statement {
    effect = "Allow"

    actions = [
       "ec2:CreateNetworkInterface",
       "ec2:DeleteNetworkInterface",
       "ec2:DescribeNetworkInterfaces",
       "ec2:AssignPrivateIpAddresses",
       "ec2:UnassignPrivateIpAddresses",
       "ec2:DescribeSubnets"
    ]

    resources = ["*"]
  }
}

data "archive_file" "public_api_source" {
  type        = "zip"
  source_dir  = "../../modules/lambdas/api/src"
  output_path = "./build/lambdas/public_api.zip"
}