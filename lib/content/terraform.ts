import type { Track } from "./types";

export const terraformTrack: Track = {
  id: "terraform",
  title: "Terraform",
  description: "Infrastructure as Code with Terraform — from zero to production",
  longDescription:
    "Learn to provision, manage, and destroy cloud infrastructure using Terraform. This course covers HCL syntax, providers, state management, modules, CI/CD integration, and security best practices.",
  icon: "Server",
  color: "#7c3aed",
  gradient: "track-terraform-gradient",
  tags: ["terraform", "iac", "infrastructure", "devops", "cloud", "aws"],
  modules: [
    {
      id: "iac-foundations",
      title: "Infrastructure as Code",
      level: "beginner",
      description: "Understand IaC principles and get Terraform installed and configured.",
      lessons: [
        {
          id: "what-is-iac",
          title: "What is Infrastructure as Code?",
          duration: 12,
          type: "lesson",
          description: "Learn the IaC philosophy, its benefits, and where Terraform fits in the ecosystem.",
          objectives: [
            "Explain the problems IaC solves",
            "Compare Terraform with other IaC tools",
            "Understand declarative vs imperative IaC",
          ],
          content: `# What is Infrastructure as Code?

**Infrastructure as Code (IaC)** means managing your servers, networks, and cloud resources using configuration files rather than manual processes.

## The Problem with Manual Infrastructure

Manually clicking through cloud consoles leads to:
- **Snowflake servers** — unique environments nobody understands
- **Drift** — production differs from staging in unknown ways
- **No audit trail** — who changed what and when?
- **Slow provisioning** — hours or days instead of minutes
- **Human error** — missed security group rules, wrong region

## How IaC Solves This

| Problem | IaC Solution |
|---------|-------------|
| Snowflakes | Identical environments from same code |
| Drift | Detect and remediate via plan |
| No audit trail | Git history of all changes |
| Slow provisioning | Minutes with automation |
| Human error | Code review catches mistakes |

## IaC Tool Landscape

| Tool | Approach | Language | Best For |
|------|----------|----------|---------|
| **Terraform** | Declarative | HCL | Multi-cloud, industry standard |
| Pulumi | Declarative | Python/TypeScript/Go | Developers who prefer general-purpose languages |
| AWS CloudFormation | Declarative | JSON/YAML | AWS-only shops |
| Ansible | Imperative | YAML | Configuration management |
| Chef/Puppet | Imperative | DSL/Ruby | Legacy config management |
| CDK | Declarative | TypeScript/Python | AWS-native teams |

## Declarative vs Imperative

**Declarative (Terraform):** You describe the *desired end state*. Terraform figures out how to get there.

\`\`\`hcl
# "I want 3 EC2 instances of this type"
resource "aws_instance" "web" {
  count         = 3
  instance_type = "t3.micro"
  ami           = "ami-0c55b159cbfafe1f0"
}
\`\`\`

**Imperative (Bash/Ansible):** You describe the *steps* to take.

\`\`\`bash
# "Run these commands in order"
for i in 1 2 3; do
  aws ec2 run-instances --instance-type t3.micro ...
done
\`\`\`

## Why Terraform Wins

1. **Multi-cloud** — AWS, GCP, Azure, Kubernetes, GitHub, Datadog, 3000+ providers
2. **State management** — knows what exists, can plan changes
3. **Plan before apply** — preview changes before making them
4. **Module ecosystem** — reuse community-built modules
5. **Industry standard** — largest IaC community

> **Key insight:** Terraform's power is the **plan** step. You always see exactly what will change before it happens.
`,
        },
        {
          id: "hcl-syntax",
          title: "HCL Syntax & Terraform Basics",
          duration: 16,
          type: "lesson",
          description: "Learn HCL syntax, block types, data types, and built-in functions.",
          objectives: [
            "Write valid HCL configuration",
            "Use all major block types (resource, variable, output, locals, data)",
            "Work with HCL data types",
            "Use built-in functions",
          ],
          content: `# HCL Syntax & Terraform Basics

HCL (HashiCorp Configuration Language) is the language Terraform uses. It's designed to be human-readable and writable.

## Installing Terraform

\`\`\`bash
# Linux (via apt)
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com \$(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
apt update && apt install terraform

# macOS
brew install terraform

# Version management (recommended)
brew install tfenv
tfenv install 1.7.0
tfenv use 1.7.0

terraform version
\`\`\`

## File Structure

\`\`\`
my-project/
├── main.tf          # main resources
├── variables.tf     # input variables
├── outputs.tf       # output values
├── providers.tf     # provider configuration
├── locals.tf        # local values
├── terraform.tfvars # variable values (not committed)
└── .terraform/      # downloaded providers (gitignore)
\`\`\`

## Block Types

\`\`\`hcl
# Provider — which cloud/service to use
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # ~> means >= 5.0, < 6.0
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Resource — infrastructure to create
resource "aws_s3_bucket" "logs" {
  bucket = "my-app-logs-prod"

  tags = {
    Environment = "prod"
    Team        = "platform"
  }
}

# Variable — parameterize configuration
variable "environment" {
  type        = string
  description = "Deployment environment"
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}

# Output — expose values after apply
output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.logs.arn
}

# Locals — computed values
locals {
  name_prefix = "\${var.project}-\${var.environment}"
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Data source — read existing resources
data "aws_vpc" "default" {
  default = true
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-24.04-amd64-server-*"]
  }
}
\`\`\`

## Data Types

\`\`\`hcl
variable "examples" {
  # Primitives
  string_val  = "hello"
  number_val  = 42
  bool_val    = true

  # Collections
  list_val = ["a", "b", "c"]
  set_val  = toset(["a", "b", "c"])   # no duplicates, unordered
  map_val  = {
    key1 = "value1"
    key2 = "value2"
  }

  # Structural
  object_val = object({
    name = string
    port = number
  })

  tuple_val = tuple([string, number, bool])
}
\`\`\`

## Built-in Functions

\`\`\`hcl
locals {
  # String functions
  upper_env   = upper(var.environment)           # "PROD"
  bucket_name = format("logs-%s-%s", var.project, var.environment)
  joined      = join(", ", ["a", "b", "c"])      # "a, b, c"
  split_vals  = split(",", "a,b,c")             # ["a", "b", "c"]

  # Collection functions
  merged_tags = merge(local.common_tags, { Extra = "value" })
  flat_list   = flatten([["a", "b"], ["c"]])     # ["a", "b", "c"]
  unique_list = distinct(["a", "b", "a"])        # ["a", "b"]
  length      = length(var.availability_zones)

  # Numeric
  max_val     = max(10, 20, 5)                   # 20
  ceil_val    = ceil(1.5)                        # 2

  # Type conversion
  str_to_num  = tonumber("42")
  num_to_str  = tostring(42)

  # Conditionals
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"

  # For expressions
  upper_names = [for name in var.names : upper(name)]
  id_map      = { for r in aws_instance.web : r.id => r.public_ip }
}
\`\`\`

## First Terraform Workflow

\`\`\`bash
terraform init          # download providers, initialize backend
terraform fmt           # format code
terraform validate      # check syntax and logic
terraform plan          # preview changes
terraform apply         # apply changes (prompts for confirmation)
terraform apply -auto-approve  # skip confirmation (CI/CD only)
terraform destroy       # destroy all managed resources
terraform show          # view current state
terraform output        # print output values
\`\`\`
`,
        },
      ],
    },
    {
      id: "terraform-core",
      title: "State, Variables & Providers",
      level: "beginner",
      description: "Master Terraform state management, variables, and provider configuration.",
      lessons: [
        {
          id: "state-management",
          title: "Terraform State",
          duration: 16,
          type: "lesson",
          description: "Understand how Terraform tracks infrastructure with state files.",
          objectives: [
            "Explain the role of terraform.tfstate",
            "Use terraform state commands",
            "Configure remote state with S3",
            "Handle state locking",
          ],
          content: `# Terraform State

Terraform state is a JSON file that maps your configuration to real-world infrastructure. It's the source of truth for what Terraform manages.

## What State Contains

\`\`\`json
{
  "version": 4,
  "resources": [
    {
      "type": "aws_instance",
      "name": "web",
      "instances": [
        {
          "attributes": {
            "id": "i-0abc123def456",
            "instance_type": "t3.micro",
            "public_ip": "54.23.45.67"
          }
        }
      ]
    }
  ]
}
\`\`\`

## State Commands

\`\`\`bash
terraform state list                          # list all resources
terraform state show aws_instance.web         # details of one resource
terraform state mv aws_instance.web aws_instance.api  # rename in state
terraform state rm aws_s3_bucket.old          # remove from state (doesn't delete resource)
terraform import aws_s3_bucket.existing my-bucket-name  # import existing resource
terraform refresh                             # sync state with real infra (use carefully)
\`\`\`

## Remote State with S3

Local state is dangerous — lost if disk dies, can't be shared. Use remote state for teams.

\`\`\`hcl
# providers.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-prod"
    key            = "services/api/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"   # for locking
  }
}
\`\`\`

\`\`\`bash
# Bootstrap: create the S3 bucket and DynamoDB table once
aws s3api create-bucket --bucket my-terraform-state-prod --region us-east-1
aws s3api put-bucket-versioning --bucket my-terraform-state-prod \\
  --versioning-configuration Status=Enabled
aws s3api put-bucket-encryption --bucket my-terraform-state-prod \\
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

aws dynamodb create-table \\
  --table-name terraform-locks \\
  --attribute-definitions AttributeName=LockID,AttributeType=S \\
  --key-schema AttributeName=LockID,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST

terraform init -migrate-state  # migrate local state to S3
\`\`\`

## State Locking

When using S3 + DynamoDB, Terraform locks state during operations:

\`\`\`bash
# If a lock is stuck (crashed process):
terraform force-unlock <lock-id>
\`\`\`

## Cross-Stack References

\`\`\`hcl
# In networking stack (outputs.tf)
output "vpc_id" {
  value = aws_vpc.main.id
}

# In application stack
data "terraform_remote_state" "networking" {
  backend = "s3"
  config = {
    bucket = "my-terraform-state-prod"
    key    = "networking/terraform.tfstate"
    region = "us-east-1"
  }
}

resource "aws_instance" "web" {
  subnet_id = data.terraform_remote_state.networking.outputs.private_subnet_id
}
\`\`\`

> **Rule:** Never manually edit terraform.tfstate. Use \`terraform state\` commands or fix via configuration.
`,
        },
        {
          id: "variables-outputs",
          title: "Variables, Outputs & Locals",
          duration: 14,
          type: "lesson",
          description: "Parameterize configurations with variables, expose values with outputs, and use locals.",
          objectives: [
            "Define and use all variable types",
            "Supply variables via CLI, files, and environment",
            "Create useful outputs",
            "Use locals for computed values",
          ],
          content: `# Variables, Outputs & Locals

## Input Variables

\`\`\`hcl
# variables.tf

variable "region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "instance_count" {
  type    = number
  default = 2
}

variable "enable_monitoring" {
  type    = bool
  default = false
}

variable "allowed_cidrs" {
  type    = list(string)
  default = ["10.0.0.0/8"]
}

variable "tags" {
  type = map(string)
  default = {}
}

variable "db_config" {
  type = object({
    engine  = string
    version = string
    port    = number
  })
  default = {
    engine  = "postgres"
    version = "16"
    port    = 5432
  }
}

variable "db_password" {
  type      = string
  sensitive = true   # redacted from plan output and logs
}
\`\`\`

## Supplying Variable Values

\`\`\`bash
# 1. CLI flags (highest precedence)
terraform apply -var="region=eu-west-1" -var="instance_count=3"

# 2. .tfvars files
terraform apply -var-file="prod.tfvars"

# 3. Auto-loaded files (no flag needed)
#    terraform.tfvars or *.auto.tfvars

# 4. Environment variables (TF_VAR_name)
export TF_VAR_region="ap-southeast-1"
export TF_VAR_db_password="s3cret"
terraform apply
\`\`\`

\`\`\`hcl
# prod.tfvars
region         = "us-east-1"
instance_count = 5
allowed_cidrs  = ["10.0.0.0/8", "172.16.0.0/12"]
tags = {
  Environment = "prod"
  CostCenter  = "engineering"
}
\`\`\`

## Locals

\`\`\`hcl
# locals.tf
locals {
  name_prefix = "\${var.project}-\${var.environment}"

  common_tags = merge(var.tags, {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
    Repo        = "github.com/org/infra"
  })

  # Computed values
  is_production = var.environment == "prod"
  instance_type = local.is_production ? "t3.large" : "t3.micro"
  az_count      = min(length(data.aws_availability_zones.available.names), 3)
}

resource "aws_instance" "web" {
  instance_type = local.instance_type
  tags          = local.common_tags
}
\`\`\`

## Outputs

\`\`\`hcl
# outputs.tf
output "instance_ids" {
  description = "IDs of created EC2 instances"
  value       = aws_instance.web[*].id
}

output "load_balancer_dns" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "db_endpoint" {
  description = "RDS endpoint (without port)"
  value       = aws_db_instance.main.endpoint
  sensitive   = true   # won't show in logs
}
\`\`\`

\`\`\`bash
terraform output                         # all outputs
terraform output load_balancer_dns       # specific output
terraform output -json                   # JSON format (for scripts)
\`\`\`
`,
        },
      ],
    },
    {
      id: "terraform-modules",
      title: "Modules & Reuse",
      level: "intermediate",
      description: "Write reusable Terraform modules and use the public registry.",
      lessons: [
        {
          id: "writing-modules",
          title: "Writing Reusable Modules",
          duration: 18,
          type: "lesson",
          description: "Create well-structured modules for reuse across environments and teams.",
          objectives: [
            "Structure a module with main.tf, variables.tf, outputs.tf",
            "Use modules from local paths and Git",
            "Version modules with git tags",
            "Build a real VPC module",
          ],
          content: `# Writing Reusable Modules

A module is a collection of Terraform files in a directory. Every Terraform configuration is a module — the root module. Child modules are called by root (or other) modules.

## Module Structure

\`\`\`
modules/
└── vpc/
    ├── main.tf        # resources
    ├── variables.tf   # inputs
    ├── outputs.tf     # outputs
    ├── versions.tf    # required providers
    └── README.md      # documentation
\`\`\`

## Example: VPC Module

\`\`\`hcl
# modules/vpc/variables.tf
variable "name" {
  type        = string
  description = "Name prefix for all resources"
}

variable "cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  type        = list(string)
  description = "CIDR blocks for public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  type        = list(string)
  description = "CIDR blocks for private subnets"
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}
\`\`\`

\`\`\`hcl
# modules/vpc/main.tf
data "aws_availability_zones" "available" {}

resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = var.name }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "\${var.name}-igw" }
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.public_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "\${var.name}-public-\${count.index + 1}" }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = { Name = "\${var.name}-private-\${count.index + 1}" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = { Name = "\${var.name}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
\`\`\`

\`\`\`hcl
# modules/vpc/outputs.tf
output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
\`\`\`

## Calling the Module

\`\`\`hcl
# environments/prod/main.tf

module "vpc" {
  source  = "../../modules/vpc"   # local path

  name            = "myapp-prod"
  cidr            = "10.0.0.0/16"
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
}

# Use module outputs
resource "aws_instance" "web" {
  subnet_id = module.vpc.public_subnet_ids[0]
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
\`\`\`

## Module Sources

\`\`\`hcl
# Local path
source = "../../modules/vpc"

# Git (with tag)
source = "git::https://github.com/myorg/terraform-modules.git//vpc?ref=v1.2.0"

# Terraform Registry
source  = "terraform-aws-modules/vpc/aws"
version = "~> 5.0"

# S3
source = "s3::https://s3.amazonaws.com/my-bucket/modules/vpc.zip"
\`\`\`

\`\`\`bash
terraform init   # always run after adding/changing module sources
terraform get    # download modules only
\`\`\`
`,
        },
      ],
    },
    {
      id: "terraform-cicd",
      title: "Terraform in CI/CD",
      level: "advanced",
      description: "Automate infrastructure deployment with GitHub Actions and security scanning.",
      lessons: [
        {
          id: "terraform-pipelines",
          title: "Terraform CI/CD Pipelines",
          duration: 18,
          type: "lesson",
          description: "Build automated Terraform workflows with GitHub Actions and OIDC authentication.",
          objectives: [
            "Configure OIDC for keyless AWS authentication",
            "Run plan on PRs and apply on merge",
            "Post plan output as PR comments",
            "Implement environment-based deployment gates",
          ],
          content: `# Terraform CI/CD Pipelines

## OIDC Authentication (No Long-Lived Keys)

\`\`\`hcl
# In Terraform: create the OIDC provider and role
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

resource "aws_iam_role" "github_actions" {
  name = "github-actions-terraform"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:myorg/myrepo:*"
        }
      }
    }]
  })
}
\`\`\`

## GitHub Actions Workflow

\`\`\`yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    branches: [main]
    paths: ['infrastructure/**']
  pull_request:
    branches: [main]
    paths: ['infrastructure/**']

permissions:
  id-token: write    # OIDC token
  contents: read
  pull-requests: write  # post plan as comment

env:
  TF_VERSION: "1.7.0"
  AWS_REGION: "us-east-1"
  WORKING_DIR: "./infrastructure/prod"

jobs:
  terraform:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: \${{ env.WORKING_DIR }}

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-terraform
          aws-region: \${{ env.AWS_REGION }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Terraform Init
        run: terraform init

      - name: Terraform Format Check
        run: terraform fmt -check -recursive

      - name: Terraform Validate
        run: terraform validate

      - name: Terraform Plan
        id: plan
        run: terraform plan -no-color -out=tfplan
        continue-on-error: true

      - name: Post Plan as PR Comment
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const output = \`#### Terraform Plan 📖
            \\\`\\\`\\\`
            \${{ steps.plan.outputs.stdout }}
            \\\`\\\`\\\`
            *Triggered by: @\${{ github.actor }}*\`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            })

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve tfplan
\`\`\`

## Security Scanning in CI

\`\`\`yaml
      - name: Security scan with tfsec
        uses: aquasecurity/tfsec-action@v1.0.3
        with:
          working_directory: \${{ env.WORKING_DIR }}
          soft_fail: false    # fail build on findings

      - name: Checkov scan
        uses: bridgecrewio/checkov-action@v12
        with:
          directory: \${{ env.WORKING_DIR }}
          quiet: true
          soft_fail: false
          framework: terraform
\`\`\`

## Workspace-Based Environments

\`\`\`hcl
# Use workspace to vary configuration
locals {
  env_config = {
    dev = {
      instance_type = "t3.micro"
      instance_count = 1
    }
    staging = {
      instance_type = "t3.small"
      instance_count = 2
    }
    prod = {
      instance_type = "t3.large"
      instance_count = 5
    }
  }
  config = local.env_config[terraform.workspace]
}

resource "aws_instance" "web" {
  count         = local.config.instance_count
  instance_type = local.config.instance_type
}
\`\`\`

\`\`\`bash
terraform workspace new prod
terraform workspace select prod
terraform apply
\`\`\`
`,
        },
      ],
    },
  ],
};
