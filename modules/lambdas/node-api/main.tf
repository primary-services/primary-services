# API Gateway
resource "aws_api_gateway_rest_api" "node_api" {
  name        = "Node API"
  description = "This is the Node API"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  parent_id   = aws_api_gateway_rest_api.node_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.node_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "node_api" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.node_api.invoke_arn
}

resource "aws_api_gateway_deployment" "node_api" {
  depends_on = [
    aws_api_gateway_integration.node_api,
    aws_api_gateway_integration.options,
  ]

  rest_api_id = aws_api_gateway_rest_api.node_api.id
}

resource "aws_api_gateway_stage" "node_api" {
  deployment_id = aws_api_gateway_deployment.node_api.id
  rest_api_id   = aws_api_gateway_rest_api.node_api.id
  stage_name    = "dev"
}

# CORS Setup
resource "aws_api_gateway_method" "options" {
  rest_api_id      = aws_api_gateway_rest_api.node_api.id
  resource_id      = aws_api_gateway_resource.proxy.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

resource "aws_api_gateway_method_response" "options" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.options.http_method

  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "options" {
  rest_api_id          = aws_api_gateway_rest_api.node_api.id
  resource_id          = aws_api_gateway_resource.proxy.id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" : "{statusCode: 200}"
  }
}

# OPTIONS integration response.
resource "aws_api_gateway_integration_response" "options" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_integration.options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}


# Lambdas
resource "aws_s3_object" "file_upload" {
  bucket = var.s3_deploy_bucket
  key    = "node_api_source.zip"
  source = "${data.archive_file.node_api_source.output_path}"
  etag = data.archive_file.node_api_source.output_md5
}

resource "aws_iam_role" "iam_for_node_api" {
  name               = "iam_for_node_api"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_lambda_function" "node_api" {
  s3_bucket         = var.s3_deploy_bucket
  s3_key            = aws_s3_object.file_upload.key
  
  function_name = var.lambda_function_name
  role          = aws_iam_role.iam_for_node_api.arn
  handler       = "src/index.handler"

  source_code_hash = data.archive_file.node_api_source.output_md5

  runtime = "nodejs20.x"
  timeout = 10
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
    
    aws_iam_role_policy_attachment.node_api_logging,
    aws_iam_role_policy_attachment.node_api_secrets,
    aws_iam_role_policy_attachment.node_api_rds,
    aws_iam_role_policy_attachment.node_api_ec2,
    aws_cloudwatch_log_group.node_api,
  ]
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.node_api.function_name}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.node_api.execution_arn}/*/*"
}

# Cloudwatch Logs

resource "aws_cloudwatch_log_group" "node_api" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 365
}

resource "aws_iam_policy" "node_api_logging" {
  name        = "node_api_logs"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_policy" "node_api_secrets" {
  name        = "node_api_secrets"
  path        = "/"
  description = "IAM policy for secrets from a lambda"
  policy      = data.aws_iam_policy_document.lambda_secrets.json
}

resource "aws_iam_policy" "node_api_rds" {
  name        = "node_api_rds"
  path        = "/"
  description = "IAM policy for rds from a lambda"
  policy      = data.aws_iam_policy_document.rds.json
}

resource "aws_iam_policy" "node_api_ec2" {
  name        = "node_api_ec2"
  path        = "/"
  description = "IAM policy for ec2 from a lambda"
  policy      = data.aws_iam_policy_document.ec2.json
}



resource "aws_iam_role_policy_attachment" "node_api_logging" {
  role       = aws_iam_role.iam_for_node_api.name
  policy_arn = aws_iam_policy.node_api_logging.arn
}

resource "aws_iam_role_policy_attachment" "node_api_secrets" {
  role       = aws_iam_role.iam_for_node_api.name
  policy_arn = aws_iam_policy.node_api_secrets.arn
}

resource "aws_iam_role_policy_attachment" "node_api_rds" {
  role       = aws_iam_role.iam_for_node_api.name
  policy_arn = aws_iam_policy.node_api_rds.arn
}

resource "aws_iam_role_policy_attachment" "node_api_ec2" {
  role       = aws_iam_role.iam_for_node_api.name
  policy_arn = aws_iam_policy.node_api_ec2.arn
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access_execution" {
  role       = aws_iam_role.iam_for_node_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
