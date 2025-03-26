# API Gateway
resource "aws_api_gateway_rest_api" "public_api" {
  name        = "Public API"
  description = "This is the Public API"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.public_api.id
  parent_id   = aws_api_gateway_rest_api.public_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.public_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "public_api" {
  rest_api_id = aws_api_gateway_rest_api.public_api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.public_api.invoke_arn
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.public_api.id
  resource_id   = aws_api_gateway_rest_api.public_api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "public_api_root" {
  rest_api_id = aws_api_gateway_rest_api.public_api.id
  resource_id = aws_api_gateway_method.proxy_root.resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.public_api.invoke_arn
}

resource "aws_api_gateway_deployment" "public_api" {
  depends_on = [
    aws_api_gateway_integration.public_api,
    aws_api_gateway_integration.public_api_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.public_api.id
}

resource "aws_api_gateway_stage" "public_api" {
  deployment_id = aws_api_gateway_deployment.public_api.id
  rest_api_id   = aws_api_gateway_rest_api.public_api.id
  stage_name    = "dev"
}

# TODO: Cors module 
# module "cors" {
#   source = "squidfunk/api-gateway-enable-cors/aws"
#   version = "0.3.1"

#   api_id          = aws_api_gateway_rest_api.public_api.id
#   api_resource_id = aws_api_gateway_resource.proxy.id
# }


# Lambdas
resource "aws_lambda_layer_version" "layer" {
  layer_name          = "python-layer"
  filename            = data.archive_file.layer.output_path
  source_code_hash    = data.archive_file.layer.output_base64sha256
  compatible_runtimes = ["python3.13"]
}

resource "aws_s3_object" "file_upload" {
  bucket = var.s3_deploy_bucket
  key    = "api_python_source.zip"
  source = "${data.archive_file.public_api_source.output_path}"
  etag = data.archive_file.public_api_source.output_md5
}

resource "aws_iam_role" "iam_for_public_api" {
  name               = "iam_for_public_api"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_lambda_function" "public_api" {
  s3_bucket         = var.s3_deploy_bucket
  s3_key            = aws_s3_object.file_upload.key
  
  function_name = var.lambda_function_name
  role          = aws_iam_role.iam_for_public_api.arn
  layers        = [aws_lambda_layer_version.layer.arn]
  handler       = "public_api.handler"

  source_code_hash = data.archive_file.public_api_source.output_md5

  runtime = "python3.13"
  publish = true

  vpc_config {
    subnet_ids         = var.vpc_subnet_ids
    security_group_ids = var.vpc_security_group_ids
  }

  logging_config {
    log_format = "Text"
  }

  environment {
    variables = {
      DBSecret = var.db_creds_secret_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access_execution,
    
    aws_iam_role_policy_attachment.public_api_logging,
    aws_iam_role_policy_attachment.public_api_secrets,
    aws_iam_role_policy_attachment.public_api_rds,
    aws_iam_role_policy_attachment.public_api_ec2,
    aws_cloudwatch_log_group.public_api,
  ]
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.public_api.function_name}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.public_api.execution_arn}/*/*"
}

# Cloudwatch Logs

resource "aws_cloudwatch_log_group" "public_api" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 365
}

resource "aws_iam_policy" "public_api_logging" {
  name        = "public_api_logs"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_policy" "public_api_secrets" {
  name        = "public_api_secrets"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_secrets.json
}

resource "aws_iam_policy" "public_api_rds" {
  name        = "public_api_rds"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.rds.json
}

resource "aws_iam_policy" "public_api_ec2" {
  name        = "public_api_ec2"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.ec2.json
}



resource "aws_iam_role_policy_attachment" "public_api_logging" {
  role       = aws_iam_role.iam_for_public_api.name
  policy_arn = aws_iam_policy.public_api_logging.arn
}

resource "aws_iam_role_policy_attachment" "public_api_secrets" {
  role       = aws_iam_role.iam_for_public_api.name
  policy_arn = aws_iam_policy.public_api_secrets.arn
}

resource "aws_iam_role_policy_attachment" "public_api_rds" {
  role       = aws_iam_role.iam_for_public_api.name
  policy_arn = aws_iam_policy.public_api_rds.arn
}

resource "aws_iam_role_policy_attachment" "public_api_ec2" {
  role       = aws_iam_role.iam_for_public_api.name
  policy_arn = aws_iam_policy.public_api_ec2.arn
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access_execution" {
  role       = aws_iam_role.iam_for_public_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
