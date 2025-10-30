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
    "method.response.header.Access-Control-Allow-Headers"       = true
    "method.response.header.Access-Control-Allow-Methods"       = true
    "method.response.header.Access-Control-Allow-Origin"        = true
    "method.response.header.Access-Control-Allow-Credentials"   = true
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
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods"     = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"      = "'*'"
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
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
  memory_size = 1024
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
      SERVER_JWT_SECRET = var.jwt_temp_secret
      SERVER_JWT=true
      SERVER_JWT_TIMEOUT=604800
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

# data "aws_cloudfront_cache_policy" "caching_disabled" {
#   name = "Managed-CachingDisabled"
# }

resource "aws_cloudfront_cache_policy" "api_cache_policy" {
  name        = "api-cache-policy"
  default_ttl = 1
  max_ttl     = 1
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "all"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Authorization"]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

data "aws_cloudfront_origin_request_policy" "all_except_host" {
  name = "Managed-CORS-CustomOrigin"
}

resource "aws_cloudfront_response_headers_policy" "allow_cors_with_credentials" {
  name    = "allow-cors-with-credentials"

  cors_config {
    access_control_allow_credentials = true

    access_control_allow_headers {
      items = ["Access-Control-Allow-Origin", "Authorization", "Content-Type"]
    }

    access_control_allow_methods {
      items = ["OPTIONS", "DELETE", "PATCH", "PUT", "POST", "GET", "HEAD"]
    }

    access_control_allow_origins {
      items = ["deadlykitten.com", "admin.deadlykitten.com", "mademocracy.com", "admin.mademocracy.com"]
    }

    access_control_expose_headers {
      items = ["Access-Control-Allow-Origin", "Authorization", "Content-Type"]
    }

    origin_override = true
  }
}

resource "aws_cloudfront_distribution" "api_gateway" {
  origin {
    domain_name = replace(aws_api_gateway_stage.node_api.invoke_url, "/^https?://([^/]*).*/", "$1")
    origin_path = "/${aws_api_gateway_stage.node_api.stage_name}"
    origin_id   = "node_api"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  aliases             = var.aliases

  default_cache_behavior {
    target_origin_id = "node_api"
    cache_policy_id = aws_cloudfront_cache_policy.api_cache_policy.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_except_host.id

    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods = ["GET", "HEAD"]
    compress = true
    viewer_protocol_policy = "https-only"

    response_headers_policy_id = aws_cloudfront_response_headers_policy.allow_cors_with_credentials.id
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = var.use_default_certificate
    acm_certificate_arn = var.certificate_arn
    minimum_protocol_version = var.certificate_minimum_protocol_version
    ssl_support_method = var.certificate_ssl_support_method
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
