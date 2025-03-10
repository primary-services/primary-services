### Scrape Town List

`cd scripts`
`node get-towns.js`

### Terraform Setup (Mac)

`brew tap hashicorp/tap`
`brew install hashicorp/tap/terraform`

### Infrastructure Goals

project/
├─ packer/
├─ ansible/
├─ terraform/
│ ├─ environments/
│ │ ├─ production/
│ │ │ ├─ apps/
│ │ │ │ ├─ blog/
│ │ │ │ ├─ ecommerce/
│ │ │ ├─ data/
│ │ │ │ ├─ efs-ecommerce/
│ │ │ │ ├─ rds-ecommerce/
│ │ │ │ ├─ s3-blog/
│ │ │ ├─ general/
│ │ │ │ ├─ main.tf
│ │ │ ├─ network/
│ │ │ │ ├─ main.tf
│ │ │ │ ├─ terraform.tfvars
│ │ │ │ ├─ variables.tf
│ │ ├─ staging/
│ │ │ ├─ apps/
│ │ │ │ ├─ ecommerce/
│ │ │ │ ├─ blog/
│ │ │ ├─ data/
│ │ │ │ ├─ efs-ecommerce/
│ │ │ │ ├─ rds-ecommerce/
│ │ │ │ ├─ s3-blog/
│ │ │ ├─ network/
│ │ ├─ test/
│ │ │ ├─ apps/
│ │ │ │ ├─ blog/
│ │ │ ├─ data/
│ │ │ │ ├─ s3-blog/
│ │ │ ├─ network/
│ ├─ modules/
│ │ ├─ apps/
│ │ │ ├─ blog/
│ │ │ ├─ ecommerce/
│ │ ├─ common/
│ │ │ ├─ acm/
│ │ │ ├─ user/
│ │ ├─ computing/
│ │ │ ├─ server/
│ │ ├─ data/
│ │ │ ├─ efs/
│ │ │ ├─ rds/
│ │ │ ├─ s3/
│ │ ├─ networking/
│ │ │ ├─ alb/
│ │ │ ├─ front-proxy/
│ │ │ ├─ vpc/
│ │ │ ├─ vpc-pairing/
├─ tools/
