resource "aws_ses_domain_identity" "emails" {
  domain = var.domain
}

resource "aws_ses_domain_dkim" "emails" {
  domain = aws_ses_domain_identity.emails.domain
}

resource "aws_ses_domain_mail_from" "emails" {
  domain           = aws_ses_domain_identity.emails.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.emails.domain}"
}