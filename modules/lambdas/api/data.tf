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

resource "null_resource" "pip_install" {
  triggers = {
    shell_hash = "${sha256(file("../../src/requirements.txt"))}"
  }

  provisioner "local-exec" {
    command = "python3 -m pip install -r ../../src/requirements.txt -t ../../src/layer/python"
  }
}

data "archive_file" "layer" {
  type        = "zip"
  source_dir  = "../../src/layer"
  output_path = "./build/lambdas/layer.zip"
  depends_on  = [null_resource.pip_install]
}

data "archive_file" "public_api_source" {
  type        = "zip"
  source_dir  = "../../src/api"
  output_path = "./build/lambdas/public_api.zip"
}