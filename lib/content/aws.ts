import { Track } from "./types";

export const awsTrack: Track = {
  id: "aws",
  title: "AWS for DevOps",
  description:
    "Master Amazon Web Services from CLI basics to production-grade architectures. Covers IAM, EC2, S3, VPC, RDS, Lambda, ECS/EKS, CloudFormation, CodePipeline, and security/cost management — with CLI commands throughout.",
  icon: "Cloud",
  color: "#f59e0b",
  gradient: "track-aws-gradient",
  level: "intermediate",
  estimatedHours: 36,
  modules: [
    // ─────────────────────────────────────────
    // MODULE 1 — Foundations & IAM
    // ─────────────────────────────────────────
    {
      id: "aws-foundations",
      title: "AWS Foundations & IAM",
      description: "Core AWS concepts, the CLI, and Identity & Access Management.",
      level: "beginner",
      lessons: [
        {
          id: "aws-global-infrastructure",
          title: "AWS Global Infrastructure",
          description: "Regions, Availability Zones, Edge Locations, and the shared responsibility model.",
          type: "lesson",
          duration: 12,
          objectives: [
            "Explain the difference between Regions and Availability Zones",
            "Choose the right region for a workload",
            "Describe the AWS shared responsibility model",
            "Navigate the AWS Management Console",
          ],
          content: `## AWS Global Infrastructure

AWS operates a global network of data centres grouped into **Regions** and **Availability Zones**.

---

## Regions

A **Region** is a geographic area containing multiple data centres. Each region is completely independent — data does not replicate between regions unless you explicitly configure it.

| Region | Code | Notes |
|---|---|---|
| US East (N. Virginia) | us-east-1 | Most services launch here first |
| US West (Oregon) | us-west-2 | Common DR pair for us-east-1 |
| EU (Ireland) | eu-west-1 | Most popular EU region |
| Asia Pacific (Singapore) | ap-southeast-1 | SEA hub |
| Asia Pacific (Mumbai) | ap-south-1 | India |

**How to choose a region:**
1. **Data residency** — legal requirements (GDPR → EU)
2. **Latency** — closest to your users
3. **Service availability** — new services launch in us-east-1 first
4. **Cost** — prices vary 10–30% between regions

---

## Availability Zones (AZs)

Each region has 2–6 **Availability Zones** — physically separate data centres within 60 miles of each other, connected by low-latency private fibre.

\`\`\`
us-east-1
├── us-east-1a  (data centre campus A)
├── us-east-1b  (data centre campus B)
├── us-east-1c  (data centre campus C)
└── us-east-1d  (data centre campus D)
\`\`\`

**Design for AZ failure:** Spread instances across ≥2 AZs. AWS SLA for multi-AZ deployments is 99.99%.

---

## Edge Locations & CloudFront

AWS has 400+ **edge locations** worldwide — Points of Presence (PoPs) used by:
- **CloudFront** (CDN) — cache content close to users
- **Route 53** (DNS) — answer DNS queries with low latency
- **AWS Shield** — absorb DDoS traffic

---

## Shared Responsibility Model

\`\`\`
AWS is responsible FOR the cloud:
├── Physical security of data centres
├── Network infrastructure
├── Hypervisor & hardware
└── Managed service software (RDS engine, Lambda runtime)

You are responsible IN the cloud:
├── Your data (encryption, backups)
├── OS patching (EC2 instances)
├── IAM users and permissions
├── Application code
├── Security group configuration
└── Network ACLs
\`\`\`

> **Tip:** A misconfigured S3 bucket is your responsibility, not AWS's. The majority of cloud breaches are customer-side misconfigurations, not AWS infrastructure failures.`,
        },
        {
          id: "aws-cli-setup",
          title: "AWS CLI Setup & Configuration",
          description: "Install, authenticate, and configure multiple AWS CLI profiles.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Install and configure the AWS CLI v2",
            "Configure named profiles for multiple accounts",
            "Use environment variables for CI authentication",
            "Query AWS resources with JMESPath and jq",
          ],
          content: `## AWS CLI Setup & Configuration

The AWS CLI is the most powerful tool for interacting with AWS — faster than the console and scriptable.

---

## Installation

\`\`\`bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip
sudo ./aws/install

# Verify
aws --version
# aws-cli/2.x.x Python/3.x.x ...
\`\`\`

---

## Initial Configuration

\`\`\`bash
aws configure
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: us-east-1
# Default output format [None]: json

# This creates:
# ~/.aws/credentials  (keys)
# ~/.aws/config       (region + output format)
\`\`\`

---

## Named Profiles (Multiple Accounts)

\`\`\`bash
# Configure a named profile
aws configure --profile production
aws configure --profile staging

# ~/.aws/credentials
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[production]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[staging]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

# Use a profile
aws s3 ls --profile production
export AWS_PROFILE=production  # set for the session
\`\`\`

---

## SSO Login (Recommended for Teams)

\`\`\`bash
# ~/.aws/config
[profile dev-account]
sso_start_url = https://myorg.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = us-east-1

# Login
aws sso login --profile dev-account
aws s3 ls --profile dev-account
\`\`\`

---

## Environment Variables (for CI)

\`\`\`bash
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"

# These override ~/.aws/credentials
aws sts get-caller-identity  # verify who you are
\`\`\`

---

## Querying with JMESPath & jq

\`\`\`bash
# List all EC2 instances with Name tag and state
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].{
    Name: Tags[?Key==\`Name\`]|[0].Value,
    ID: InstanceId,
    State: State.Name,
    Type: InstanceType,
    IP: PublicIpAddress
  }' \
  --output table

# Get just running instance IDs
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].InstanceId' \
  --output text

# List S3 buckets sorted by creation date (jq)
aws s3api list-buckets \
  | jq '.Buckets | sort_by(.CreationDate) | .[] | .Name'

# Check costs for last 7 days
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-08 \
  --granularity DAILY \
  --metrics BlendedCost \
  --query 'ResultsByTime[*].{Date:TimePeriod.Start,Cost:Total.BlendedCost.Amount}' \
  --output table
\`\`\`

---

## Useful CLI Tricks

\`\`\`bash
# Auto-complete
aws s3 <TAB><TAB>

# Paginate (auto-handles next tokens)
aws ec2 describe-instances --no-paginate  # dump all pages

# Dry run (check permissions without action)
aws ec2 run-instances --dry-run ...

# Wait for an operation to complete
aws ec2 wait instance-running --instance-ids i-1234567890abcdef0

# Get help for any command
aws s3 cp help
aws ec2 describe-instances help
\`\`\``,
        },
        {
          id: "iam-deep-dive",
          title: "IAM Deep Dive",
          description: "Users, groups, roles, policies, and least-privilege patterns.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create IAM users, groups, and roles via CLI",
            "Write custom IAM policies in JSON",
            "Assume IAM roles with STS",
            "Enforce MFA with IAM condition keys",
            "Use IAM Access Analyzer to find overly permissive policies",
          ],
          content: `## IAM Deep Dive

IAM (Identity and Access Management) controls *who* can do *what* to *which* AWS resources.

---

## Core Concepts

\`\`\`
Users    → individual people or service accounts (long-term credentials)
Groups   → collections of users sharing the same permissions
Roles    → assumed identities (EC2, Lambda, CI, cross-account)
Policies → JSON documents defining Allow/Deny rules
\`\`\`

**Always prefer Roles over Users for:**
- EC2 instances (instance profiles)
- Lambda functions
- GitHub Actions (OIDC)
- Cross-account access

---

## Creating IAM Resources via CLI

\`\`\`bash
# Create a user
aws iam create-user --user-name alice

# Create a group and add the user
aws iam create-group --group-name developers
aws iam add-user-to-group --user-name alice --group-name developers

# Create an access key for the user
aws iam create-access-key --user-name alice

# Enable console access (with password)
aws iam create-login-profile --user-name alice \
  --password "TempPass123!" \
  --password-reset-required

# List all users
aws iam list-users --query 'Users[*].{Name:UserName,Created:CreateDate}' --output table
\`\`\`

---

## Writing IAM Policies

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3AppBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::myapp-prod-data",
        "arn:aws:s3:::myapp-prod-data/*"
      ]
    },
    {
      "Sid": "DenyDeleteBucket",
      "Effect": "Deny",
      "Action": "s3:DeleteBucket",
      "Resource": "*"
    }
  ]
}
\`\`\`

\`\`\`bash
# Create and attach a policy
aws iam create-policy \
  --policy-name S3AppBucketAccess \
  --policy-document file://s3-policy.json

aws iam attach-group-policy \
  --group-name developers \
  --policy-arn arn:aws:iam::123456789012:policy/S3AppBucketAccess
\`\`\`

---

## IAM Roles

\`\`\`bash
# Create a role for EC2 instances
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
  --role-name EC2AppRole \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name EC2AppRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Create instance profile and associate
aws iam create-instance-profile --instance-profile-name EC2AppProfile
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2AppProfile \
  --role-name EC2AppRole
\`\`\`

---

## Assuming Roles with STS

\`\`\`bash
# Assume a role (cross-account or elevated)
aws sts assume-role \
  --role-arn "arn:aws:iam::999999999999:role/ProductionDeploy" \
  --role-session-name "deploy-session-$(date +%s)"

# Use the returned credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# Or configure in profile
aws configure --profile prod-deploy set role_arn arn:aws:iam::999999999999:role/ProductionDeploy
aws configure --profile prod-deploy set source_profile default
aws s3 ls --profile prod-deploy
\`\`\`

---

## Enforcing MFA

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "BoolIfExists": {
        "aws:MultiFactorAuthPresent": "false"
      }
    }
  }]
}
\`\`\`

---

## IAM Access Analyzer

\`\`\`bash
# Create an analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name account-analyzer \
  --type ACCOUNT

# List findings (publicly accessible resources)
aws accessanalyzer list-findings \
  --analyzer-arn arn:aws:access-analyzer:us-east-1:123456789012:analyzer/account-analyzer \
  --query 'findings[*].{Resource:resource,Type:resourceType,Status:status}' \
  --output table

# Generate least-privilege policy from CloudTrail events
aws accessanalyzer generate-policy \
  --trail-arn arn:aws:cloudtrail:us-east-1:123456789012:trail/my-trail
\`\`\`

> **Tip:** The AWS Security Reference Architecture (SRA) recommends a dedicated **security tooling account** with cross-account read access. Never run security tooling in the same account as production workloads.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 2 — Compute
    // ─────────────────────────────────────────
    {
      id: "aws-compute",
      title: "Compute: EC2 & Lambda",
      description: "Virtual machines, auto scaling, and serverless functions.",
      level: "beginner",
      lessons: [
        {
          id: "ec2-fundamentals",
          title: "EC2 Fundamentals",
          description: "Launch, configure, and connect to EC2 instances. AMIs, key pairs, and user data.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Launch an EC2 instance via CLI with all required parameters",
            "Connect via SSH and Session Manager",
            "Create and use custom AMIs",
            "Configure Auto Scaling Groups with Launch Templates",
          ],
          content: `## EC2 Fundamentals

EC2 (Elastic Compute Cloud) provides resizable virtual machines in the cloud.

---

## Launching an Instance via CLI

\`\`\`bash
# Get the latest Amazon Linux 2023 AMI ID
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-*-x86_64" \
            "Name=state,Values=available" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' \
  --output text)

echo "Using AMI: \$AMI_ID"

# Create a key pair
aws ec2 create-key-pair \
  --key-name my-key \
  --query 'KeyMaterial' \
  --output text > my-key.pem
chmod 400 my-key.pem

# Launch an instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id \$AMI_ID \
  --instance-type t3.micro \
  --key-name my-key \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --iam-instance-profile Name=EC2AppProfile \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server},{Key=Env,Value=dev}]' \
  --user-data file://init.sh \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "Launched: \$INSTANCE_ID"

# Wait until running
aws ec2 wait instance-running --instance-ids \$INSTANCE_ID

# Get public IP
aws ec2 describe-instances \
  --instance-ids \$INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
\`\`\`

---

## User Data Script (Bootstrap)

\`\`\`bash
# init.sh — runs as root on first boot
#!/bin/bash
yum update -y
yum install -y nginx git

systemctl enable nginx
systemctl start nginx

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -c ssm:/cloudwatch-config -s
\`\`\`

---

## Connecting to Instances

\`\`\`bash
# SSH (requires public IP + open port 22)
ssh -i my-key.pem ec2-user@<public-ip>

# Session Manager (no SSH, no open ports needed — preferred)
aws ssm start-session --target \$INSTANCE_ID

# Port forwarding via SSM (no bastion needed)
aws ssm start-session \
  --target \$INSTANCE_ID \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["5432"],"localPortNumber":["15432"]}'
# Now connect to localhost:15432 → forwards to RDS on port 5432
\`\`\`

---

## Creating a Custom AMI

\`\`\`bash
# Snapshot a running instance
AMI_ID=$(aws ec2 create-image \
  --instance-id \$INSTANCE_ID \
  --name "myapp-base-$(date +%Y%m%d)" \
  --description "Pre-configured app server" \
  --no-reboot \
  --query 'ImageId' \
  --output text)

aws ec2 wait image-available --image-ids \$AMI_ID
echo "AMI ready: \$AMI_ID"
\`\`\`

---

## Auto Scaling Groups

\`\`\`bash
# Create a Launch Template
aws ec2 create-launch-template \
  --launch-template-name my-app-lt \
  --version-description "v1" \
  --launch-template-data '{
    "ImageId": "ami-0123456789abcdef0",
    "InstanceType": "t3.small",
    "IamInstanceProfile": {"Name": "EC2AppProfile"},
    "SecurityGroupIds": ["sg-0123456789abcdef0"],
    "UserData": "'$(base64 -w0 init.sh)'"
  }'

# Create the Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-app-asg \
  --launch-template "LaunchTemplateName=my-app-lt,Version=\$Latest" \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-aaa,subnet-bbb" \
  --target-group-arns arn:aws:elasticloadbalancing:...

# Scale manually
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name my-app-asg \
  --desired-capacity 4
\`\`\`

---

## Common CLI Operations

\`\`\`bash
# Stop / start / terminate
aws ec2 stop-instances --instance-ids \$INSTANCE_ID
aws ec2 start-instances --instance-ids \$INSTANCE_ID
aws ec2 terminate-instances --instance-ids \$INSTANCE_ID

# List all instances in a table
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].{
    Name:Tags[?Key==\`Name\`]|[0].Value,
    ID:InstanceId,State:State.Name,Type:InstanceType,AZ:Placement.AvailabilityZone
  }' --output table

# Get instance type pricing
aws ec2 describe-spot-price-history \
  --instance-types t3.micro t3.small \
  --product-descriptions "Linux/UNIX" \
  --start-time $(date -u +"%Y-%m-%dT%H:%M:%S") \
  --query 'SpotPriceHistory[*].{Type:InstanceType,Price:SpotPrice,AZ:AvailabilityZone}' \
  --output table
\`\`\``,
        },
        {
          id: "lambda-serverless",
          title: "Lambda & Serverless",
          description: "Functions, triggers, layers, concurrency, and deploying with SAM.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Deploy a Lambda function via CLI",
            "Configure triggers (API Gateway, S3, SQS, EventBridge)",
            "Use Lambda Layers for shared dependencies",
            "Monitor Lambda with CloudWatch Logs and X-Ray",
          ],
          content: `## Lambda & Serverless

Lambda runs your code in response to events without provisioning servers. You pay per invocation and duration (rounded to 1ms).

---

## Deploying a Function via CLI

\`\`\`bash
# Create the function code
cat > index.mjs << 'EOF'
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };
};
EOF

# Package it
zip function.zip index.mjs

# Create the function
aws lambda create-function \
  --function-name my-api-handler \
  --runtime nodejs20.x \
  --role arn:aws:iam::123456789012:role/LambdaExecutionRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables='{DB_HOST=mydb.cluster.amazonaws.com,LOG_LEVEL=info}'

# Test invoke
aws lambda invoke \
  --function-name my-api-handler \
  --payload '{"key": "value"}' \
  --cli-binary-format raw-in-base64-out \
  response.json
cat response.json

# Update function code
zip function.zip index.mjs
aws lambda update-function-code \
  --function-name my-api-handler \
  --zip-file fileb://function.zip

# Publish a version
aws lambda publish-version --function-name my-api-handler

# Create an alias (for blue/green deployments)
aws lambda create-alias \
  --function-name my-api-handler \
  --name production \
  --function-version 5 \
  --routing-config AdditionalVersionWeights={"4"=0.1}  # 10% to v4, 90% to v5
\`\`\`

---

## Common Triggers

\`\`\`bash
# API Gateway trigger (HTTP endpoint)
aws apigatewayv2 create-api \
  --name my-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:123456789012:function:my-api-handler

# S3 trigger (process uploads)
aws s3api put-bucket-notification-configuration \
  --bucket my-uploads-bucket \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [{
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:process-upload",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {"Key": {"FilterRules": [{"Name": "suffix","Value": ".jpg"}]}}
    }]
  }'

# SQS trigger (message queue processing)
aws lambda create-event-source-mapping \
  --function-name process-orders \
  --event-source-arn arn:aws:sqs:us-east-1:123456789012:orders-queue \
  --batch-size 10 \
  --bisect-batch-on-function-error

# EventBridge rule (cron schedule)
aws events put-rule \
  --name daily-cleanup \
  --schedule-expression "cron(0 2 * * ? *)"  # 2 AM UTC daily

aws events put-targets \
  --rule daily-cleanup \
  --targets 'Id=cleanup-fn,Arn=arn:aws:lambda:us-east-1:123456789012:function:daily-cleanup'
\`\`\`

---

## Lambda Layers

Layers share code (libraries, runtimes, data) across functions.

\`\`\`bash
# Create a layer with node_modules
mkdir -p nodejs
npm install --prefix nodejs aws-sdk lodash
zip -r layer.zip nodejs/

aws lambda publish-layer-version \
  --layer-name shared-deps \
  --compatible-runtimes nodejs20.x \
  --zip-file fileb://layer.zip

# Attach the layer to a function
aws lambda update-function-configuration \
  --function-name my-api-handler \
  --layers arn:aws:lambda:us-east-1:123456789012:layer:shared-deps:1
\`\`\`

---

## Monitoring & Debugging

\`\`\`bash
# Tail live logs
aws logs tail /aws/lambda/my-api-handler --follow

# Get last 5 minutes of logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-api-handler \
  --start-time $(date -d '5 minutes ago' +%s)000 \
  --filter-pattern "ERROR"

# View concurrency metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name ConcurrentExecutions \
  --dimensions Name=FunctionName,Value=my-api-handler \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Maximum
\`\`\`

> **Tip:** Use **Provisioned Concurrency** for latency-sensitive APIs — it pre-warms Lambda instances and eliminates cold starts. Enable it for your \`production\` alias, not the function itself, so it doesn't slow deployments.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 3 — Storage & Databases
    // ─────────────────────────────────────────
    {
      id: "aws-storage",
      title: "Storage & Databases",
      description: "S3, EBS, EFS, RDS, DynamoDB — the full AWS data tier.",
      level: "intermediate",
      lessons: [
        {
          id: "s3-deep-dive",
          title: "S3 Deep Dive",
          description: "Buckets, lifecycle policies, versioning, replication, presigned URLs, and cost optimisation.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Create and configure S3 buckets with security best practices",
            "Implement lifecycle policies and intelligent tiering",
            "Generate presigned URLs for temporary object access",
            "Configure cross-region replication",
            "Analyse S3 costs with Storage Lens",
          ],
          content: `## S3 Deep Dive

S3 (Simple Storage Service) provides object storage with 11 nines (99.999999999%) of durability.

---

## Creating a Secure Bucket

\`\`\`bash
# Create bucket
aws s3api create-bucket \
  --bucket my-app-data-$(aws sts get-caller-identity --query Account --output text) \
  --region us-east-1

# Block ALL public access (security baseline)
aws s3api put-public-access-block \
  --bucket my-app-data-123456789012 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-app-data-123456789012 \
  --versioning-configuration Status=Enabled

# Enable default encryption (SSE-S3)
aws s3api put-bucket-encryption \
  --bucket my-app-data-123456789012 \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
      "BucketKeyEnabled": true
    }]
  }'

# Enable access logging
aws s3api put-bucket-logging \
  --bucket my-app-data-123456789012 \
  --bucket-logging-status '{
    "LoggingEnabled": {
      "TargetBucket": "my-access-logs",
      "TargetPrefix": "s3/my-app-data/"
    }
  }'
\`\`\`

---

## Common S3 Operations

\`\`\`bash
# Upload a file
aws s3 cp myfile.txt s3://my-bucket/path/myfile.txt

# Upload with storage class
aws s3 cp large-archive.zip s3://my-bucket/ \
  --storage-class INTELLIGENT_TIERING

# Sync a directory
aws s3 sync ./dist s3://my-bucket/app/ --delete

# Download
aws s3 cp s3://my-bucket/path/myfile.txt ./local/

# List objects with sizes
aws s3 ls s3://my-bucket/ --recursive --human-readable --summarize

# Copy between buckets
aws s3 cp s3://source-bucket/key s3://dest-bucket/key --source-region us-west-2

# Delete an object
aws s3 rm s3://my-bucket/path/old-file.txt

# Empty a bucket (required before deletion)
aws s3 rm s3://my-bucket/ --recursive
aws s3 rb s3://my-bucket
\`\`\`

---

## Lifecycle Policies

\`\`\`bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-app-data-123456789012 \
  --lifecycle-configuration '{
    "Rules": [
      {
        "ID": "transition-and-expire",
        "Status": "Enabled",
        "Filter": {"Prefix": "logs/"},
        "Transitions": [
          {"Days": 30, "StorageClass": "STANDARD_IA"},
          {"Days": 90, "StorageClass": "GLACIER_IR"},
          {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
        ],
        "Expiration": {"Days": 2555}
      },
      {
        "ID": "cleanup-old-versions",
        "Status": "Enabled",
        "Filter": {},
        "NoncurrentVersionExpiration": {"NoncurrentDays": 30}
      }
    ]
  }'
\`\`\`

---

## Presigned URLs

\`\`\`bash
# Generate a presigned URL (expires in 1 hour)
aws s3 presign s3://my-bucket/report.pdf --expires-in 3600

# Presigned POST URL for browser uploads (up to 5GB)
aws s3 presign s3://my-bucket/uploads/myfile.csv \
  --expires-in 900 \
  --method PUT

# With Python SDK (for custom conditions)
# aws s3api generate-presigned-post is better for browser uploads
\`\`\`

---

## Cross-Region Replication

\`\`\`bash
# Enable replication (both buckets must have versioning enabled)
aws s3api put-bucket-replication \
  --bucket source-bucket \
  --replication-configuration '{
    "Role": "arn:aws:iam::123456789012:role/S3ReplicationRole",
    "Rules": [{
      "Status": "Enabled",
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::dest-bucket-us-west-2",
        "StorageClass": "STANDARD_IA"
      },
      "DeleteMarkerReplication": {"Status": "Enabled"}
    }]
  }'
\`\`\`

> **Tip:** Use **S3 Intelligent-Tiering** for data with unpredictable access patterns. It automatically moves objects between frequent and infrequent access tiers with no retrieval fees. For >90 days of storage, it almost always saves money over STANDARD.`,
        },
        {
          id: "rds-and-dynamodb",
          title: "RDS & DynamoDB",
          description: "Managed relational and NoSQL databases — provisioning, backups, and access patterns.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create an RDS Aurora cluster via CLI",
            "Configure Multi-AZ and read replicas",
            "Design a DynamoDB table with partition and sort keys",
            "Use DynamoDB Streams and GSIs",
          ],
          content: `## RDS & DynamoDB

AWS offers both managed relational (RDS/Aurora) and managed NoSQL (DynamoDB) databases.

---

## RDS Aurora Cluster

\`\`\`bash
# Create a subnet group (required for RDS)
aws rds create-db-subnet-group \
  --db-subnet-group-name my-db-subnets \
  --db-subnet-group-description "Private subnets for RDS" \
  --subnet-ids subnet-aaa subnet-bbb

# Create Aurora PostgreSQL cluster
aws rds create-db-cluster \
  --db-cluster-identifier my-aurora-cluster \
  --engine aurora-postgresql \
  --engine-version 15.4 \
  --master-username dbadmin \
  --master-user-password "$(openssl rand -base64 24)" \
  --db-subnet-group-name my-db-subnets \
  --vpc-security-group-ids sg-0123456789abcdef0 \
  --storage-encrypted \
  --backup-retention-period 7 \
  --deletion-protection \
  --enable-cloudwatch-logs-exports '["postgresql"]'

# Add a writer instance
aws rds create-db-instance \
  --db-instance-identifier my-aurora-writer \
  --db-cluster-identifier my-aurora-cluster \
  --db-instance-class db.r7g.large \
  --engine aurora-postgresql

# Add a read replica
aws rds create-db-instance \
  --db-instance-identifier my-aurora-reader \
  --db-cluster-identifier my-aurora-cluster \
  --db-instance-class db.r7g.large \
  --engine aurora-postgresql

# Wait for available
aws rds wait db-instance-available --db-instance-identifier my-aurora-writer

# Get connection endpoint
aws rds describe-db-clusters \
  --db-cluster-identifier my-aurora-cluster \
  --query 'DBClusters[0].{Writer:Endpoint,Reader:ReaderEndpoint,Port:Port}'
\`\`\`

---

## RDS Snapshots & Restore

\`\`\`bash
# Manual snapshot
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier my-aurora-cluster \
  --db-cluster-snapshot-identifier my-snapshot-$(date +%Y%m%d)

# Restore to a new cluster
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier my-restored-cluster \
  --snapshot-identifier my-snapshot-20240115 \
  --engine aurora-postgresql

# Point-in-time restore (to any second within backup window)
aws rds restore-db-cluster-to-point-in-time \
  --db-cluster-identifier my-pitr-cluster \
  --source-db-cluster-identifier my-aurora-cluster \
  --restore-to-time 2024-01-15T14:30:00Z
\`\`\`

---

## DynamoDB

DynamoDB is a fully managed key-value and document database with single-digit millisecond latency.

\`\`\`bash
# Create a table
aws dynamodb create-table \
  --table-name orders \
  --attribute-definitions \
    AttributeName=customerId,AttributeType=S \
    AttributeName=orderId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=customerId,KeyType=HASH \
    AttributeName=orderId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[{
    "IndexName": "CreatedAtIndex",
    "KeySchema": [
      {"AttributeName":"customerId","KeyType":"HASH"},
      {"AttributeName":"createdAt","KeyType":"RANGE"}
    ],
    "Projection": {"ProjectionType":"ALL"}
  }]' \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

# Put an item
aws dynamodb put-item \
  --table-name orders \
  --item '{
    "customerId": {"S": "cust-123"},
    "orderId": {"S": "ord-456"},
    "createdAt": {"S": "2024-01-15T10:00:00Z"},
    "total": {"N": "99.99"},
    "status": {"S": "pending"}
  }'

# Query by partition key
aws dynamodb query \
  --table-name orders \
  --key-condition-expression "customerId = :cid" \
  --expression-attribute-values '{":cid": {"S": "cust-123"}}' \
  --query 'Items[*].{OrderId:orderId.S,Status:status.S,Total:total.N}' \
  --output table

# Query with sort key range
aws dynamodb query \
  --table-name orders \
  --index-name CreatedAtIndex \
  --key-condition-expression "customerId = :cid AND createdAt BETWEEN :start AND :end" \
  --expression-attribute-values '{
    ":cid": {"S": "cust-123"},
    ":start": {"S": "2024-01-01"},
    ":end": {"S": "2024-01-31"}
  }'

# Update an item
aws dynamodb update-item \
  --table-name orders \
  --key '{"customerId": {"S": "cust-123"}, "orderId": {"S": "ord-456"}}' \
  --update-expression "SET #s = :newStatus" \
  --expression-attribute-names '{"#s": "status"}' \
  --expression-attribute-values '{":newStatus": {"S": "shipped"}}'
\`\`\`

> **Tip:** The most important DynamoDB design decision is choosing the right partition key. A poor partition key (like a date or boolean) creates "hot partitions" that throttle. Use high-cardinality keys (user ID, order ID) and add a random suffix if you need to spread writes across items with the same key.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 4 — Networking
    // ─────────────────────────────────────────
    {
      id: "aws-networking",
      title: "VPC & Networking",
      description: "VPCs, subnets, security groups, NAT gateways, VPC peering, and Route 53.",
      level: "intermediate",
      lessons: [
        {
          id: "vpc-fundamentals",
          title: "VPC Design & Security Groups",
          description: "Build a production-grade VPC with public/private subnets, NAT, and security group rules.",
          type: "lesson",
          duration: 24,
          objectives: [
            "Create a VPC with public and private subnets across two AZs",
            "Configure Internet Gateway, NAT Gateway, and route tables",
            "Write precise security group rules",
            "Implement VPC Flow Logs for network visibility",
          ],
          content: `## VPC Design & Security Groups

A VPC (Virtual Private Cloud) is your private network in AWS. Good VPC design is the foundation of cloud security.

---

## Standard 3-Tier VPC Architecture

\`\`\`
Internet
    │
 [IGW]
    │
 Public Subnets (10.0.0.0/24, 10.0.1.0/24)
    │  Load Balancers, NAT Gateways, Bastion (or none)
    │
[NAT GW]
    │
 Private App Subnets (10.0.10.0/24, 10.0.11.0/24)
    │  EC2, ECS tasks, Lambda (in VPC)
    │
 Private DB Subnets (10.0.20.0/24, 10.0.21.0/24)
       RDS, ElastiCache, DynamoDB endpoints
\`\`\`

---

## Creating the VPC via CLI

\`\`\`bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-prod-vpc}]' \
  --query 'Vpc.VpcId' --output text)

# Enable DNS hostnames
aws ec2 modify-vpc-attribute --vpc-id \$VPC_ID --enable-dns-hostnames

# Create public subnets (2 AZs)
PUB_SN_1=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.0.0/24 --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
PUB_SN_2=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.1.0/24 --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)

# Create private subnets
PRI_SN_1=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.10.0/24 --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
PRI_SN_2=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.11.0/24 --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)

# Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id \$IGW_ID --vpc-id \$VPC_ID

# Public route table
PUB_RT=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id \$IGW_ID
aws ec2 associate-route-table --route-table-id \$PUB_RT --subnet-id \$PUB_SN_1
aws ec2 associate-route-table --route-table-id \$PUB_RT --subnet-id \$PUB_SN_2

# NAT Gateway (one per AZ for HA, one for cost savings)
EIP=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_ID=$(aws ec2 create-nat-gateway \
  --subnet-id \$PUB_SN_1 \
  --allocation-id \$EIP \
  --query 'NatGateway.NatGatewayId' --output text)
aws ec2 wait nat-gateway-available --nat-gateway-ids \$NAT_ID

# Private route table → NAT
PRI_RT=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$PRI_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id \$NAT_ID
aws ec2 associate-route-table --route-table-id \$PRI_RT --subnet-id \$PRI_SN_1
aws ec2 associate-route-table --route-table-id \$PRI_RT --subnet-id \$PRI_SN_2
\`\`\`

---

## Security Groups

\`\`\`bash
# ALB security group — public internet
ALB_SG=$(aws ec2 create-security-group \
  --group-name alb-sg --description "ALB inbound" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$ALB_SG \
  --ip-permissions \
    'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]' \
    'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]'

# App security group — only from ALB
APP_SG=$(aws ec2 create-security-group \
  --group-name app-sg --description "App instances" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$APP_SG \
  --protocol tcp --port 3000 --source-group \$ALB_SG

# DB security group — only from app tier
DB_SG=$(aws ec2 create-security-group \
  --group-name db-sg --description "RDS instances" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$DB_SG \
  --protocol tcp --port 5432 --source-group \$APP_SG
\`\`\`

---

## VPC Flow Logs

\`\`\`bash
# Create CloudWatch Log Group
aws logs create-log-group --log-group-name /aws/vpc/flowlogs

# Enable flow logs
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids \$VPC_ID \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs \
  --deliver-logs-permission-arn arn:aws:iam::123456789012:role/VPCFlowLogsRole

# Query rejected traffic (Insights)
aws logs start-query \
  --log-group-name /aws/vpc/flowlogs \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, srcAddr, dstAddr, dstPort, action | filter action = "REJECT" | sort @timestamp desc | limit 20'
\`\`\`

> **Tip:** Enable **VPC Endpoints** for services like S3 and DynamoDB. Traffic uses the AWS private network instead of going through the NAT Gateway, which saves both cost and latency. A single S3 VPC endpoint can eliminate thousands of dollars in NAT Gateway data processing charges per month.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 5 — Containers
    // ─────────────────────────────────────────
    {
      id: "aws-containers",
      title: "Containers: ECR, ECS & EKS",
      description: "Container registry, managed container orchestration, and Kubernetes on AWS.",
      level: "intermediate",
      lessons: [
        {
          id: "ecr-and-ecs",
          title: "ECR & ECS Fargate",
          description: "Push images to ECR and deploy containerised workloads with ECS Fargate.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Create an ECR repository and push a Docker image",
            "Define ECS task definitions and services",
            "Deploy to ECS Fargate with an ALB",
            "Configure ECS service auto scaling",
          ],
          content: `## ECR & ECS Fargate

ECR (Elastic Container Registry) stores Docker images. ECS (Elastic Container Service) runs them without managing servers when using the Fargate launch type.

---

## ECR — Push an Image

\`\`\`bash
# Create repository
aws ecr create-repository \
  --repository-name myapp \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Get the registry URI
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
REGISTRY=\$ACCOUNT.dkr.ecr.\$REGION.amazonaws.com

# Login
aws ecr get-login-password --region \$REGION \
  | docker login --username AWS --password-stdin \$REGISTRY

# Build, tag, push
docker build -t myapp:v1.0.0 .
docker tag myapp:v1.0.0 \$REGISTRY/myapp:v1.0.0
docker push \$REGISTRY/myapp:v1.0.0

# List images
aws ecr describe-images \
  --repository-name myapp \
  --query 'imageDetails[*].{Tag:imageTags[0],Pushed:imagePushedAt,Size:imageSizeInBytes}' \
  --output table

# ECR lifecycle policy (keep last 10 tagged images)
aws ecr put-lifecycle-policy \
  --repository-name myapp \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 production images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["v"],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {"type": "expire"}
    }]
  }'
\`\`\`

---

## ECS Task Definition

\`\`\`bash
aws ecs register-task-definition --cli-input-json '{
  "family": "myapp",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/myapp-task-role",
  "containerDefinitions": [{
    "name": "myapp",
    "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0",
    "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
    "environment": [
      {"name": "NODE_ENV", "value": "production"}
    ],
    "secrets": [
      {"name": "DB_PASSWORD", "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/myapp/db_password"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/myapp",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    }
  }]
}'
\`\`\`

---

## ECS Service + ALB

\`\`\`bash
# Create ECS cluster
aws ecs create-cluster --cluster-name production

# Create service
aws ecs create-service \
  --cluster production \
  --service-name myapp \
  --task-definition myapp:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-aaa","subnet-bbb"],
      "securityGroups": ["sg-app"],
      "assignPublicIp": "DISABLED"
    }
  }' \
  --load-balancers '[{
    "targetGroupArn": "arn:aws:elasticloadbalancing:...",
    "containerName": "myapp",
    "containerPort": 3000
  }]' \
  --deployment-configuration '{
    "minimumHealthyPercent": 50,
    "maximumPercent": 200,
    "deploymentCircuitBreaker": {"enable": true, "rollback": true}
  }'

# Update the service (rolling deploy)
aws ecs update-service \
  --cluster production \
  --service myapp \
  --task-definition myapp:2  # new version
\`\`\`

---

## ECS Auto Scaling

\`\`\`bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/production/myapp \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 20

# Scale on CPU utilisation
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/production/myapp \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 60.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
\`\`\`

> **Tip:** Enable ECS **deployment circuit breaker** (shown above). It automatically rolls back a bad deployment if tasks fail to reach RUNNING state, saving you from manually rolling back at 3 AM.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 6 — DevOps Services
    // ─────────────────────────────────────────
    {
      id: "aws-devops-services",
      title: "AWS DevOps Services",
      description: "CloudFormation, CodePipeline, CodeBuild, CodeDeploy, and Systems Manager.",
      level: "intermediate",
      lessons: [
        {
          id: "cloudformation",
          title: "CloudFormation Infrastructure as Code",
          description: "Stacks, templates, change sets, nested stacks, and drift detection.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Write a CloudFormation template for a web application",
            "Use change sets to preview infrastructure changes",
            "Detect and remediate stack drift",
            "Organise stacks with nested stacks and StackSets",
          ],
          content: `## CloudFormation Infrastructure as Code

CloudFormation provisions and manages AWS resources through declarative JSON/YAML templates.

---

## Template Structure

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Web application stack

Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, production]
    Default: dev
  InstanceType:
    Type: String
    Default: t3.small

Mappings:
  EnvConfig:
    dev:
      MinSize: 1
      MaxSize: 2
    production:
      MinSize: 2
      MaxSize: 10

Conditions:
  IsProduction: !Equals [!Ref Environment, production]

Resources:
  AppSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: App server SG
      VpcId: !ImportValue SharedVPC-VPCID
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          SourceSecurityGroupId: !ImportValue SharedVPC-ALBSGID

  AppASG:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: !FindInMap [EnvConfig, !Ref Environment, MinSize]
      MaxSize: !FindInMap [EnvConfig, !Ref Environment, MaxSize]
      DesiredCapacity: !FindInMap [EnvConfig, !Ref Environment, MinSize]
      LaunchTemplate:
        LaunchTemplateId: !Ref AppLaunchTemplate
        Version: !GetAtt AppLaunchTemplate.LatestVersionNumber
      VPCZoneIdentifier:
        - !ImportValue SharedVPC-PrivateSubnet1
        - !ImportValue SharedVPC-PrivateSubnet2
      TargetGroupARNs:
        - !Ref AppTargetGroup
    UpdatePolicy:
      AutoScalingRollingUpdate:
        MinInstancesInService: 1
        MaxBatchSize: 1

  # Only create alarm in production
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Condition: IsProduction
    Properties:
      AlarmName: !Sub "\${AWS::StackName}-high-cpu"
      MetricName: CPUUtilization
      Namespace: AWS/EC2
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold

Outputs:
  AppURL:
    Value: !Sub "https://\${AppALB.DNSName}"
    Export:
      Name: !Sub "\${AWS::StackName}-AppURL"
\`\`\`

---

## CLI Operations

\`\`\`bash
# Validate template
aws cloudformation validate-template --template-body file://template.yaml

# Create stack
aws cloudformation create-stack \
  --stack-name myapp-production \
  --template-body file://template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=InstanceType,ParameterValue=t3.small \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --on-failure DO_NOTHING  # ROLLBACK | DELETE | DO_NOTHING

aws cloudformation wait stack-create-complete --stack-name myapp-production

# Create a Change Set (preview changes before applying)
aws cloudformation create-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type \
  --template-body file://template-v2.yaml \
  --parameters ParameterKey=Environment,ParameterValue=production

# Review the change set
aws cloudformation describe-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type \
  --query 'Changes[*].ResourceChange.{Action:Action,Resource:LogicalResourceId,Type:ResourceType}'

# Execute (or delete to cancel)
aws cloudformation execute-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type

# Detect drift
aws cloudformation detect-stack-drift --stack-name myapp-production
aws cloudformation describe-stack-drift-detection-status \
  --stack-drift-detection-id <id>
aws cloudformation describe-stack-resource-drifts \
  --stack-name myapp-production \
  --stack-resource-drift-status MODIFIED

# Delete stack
aws cloudformation delete-stack --stack-name myapp-production
aws cloudformation wait stack-delete-complete --stack-name myapp-production
\`\`\`

---

## Useful CloudFormation Patterns

\`\`\`bash
# Export stack outputs for cross-stack references
# In stack A:
Outputs:
  VPCID:
    Value: !Ref VPC
    Export:
      Name: MyVPC-VPCID

# In stack B:
Resources:
  Subnet:
    Properties:
      VpcId: !ImportValue MyVPC-VPCID

# List all exports
aws cloudformation list-exports \
  --query 'Exports[*].{Name:Name,Value:Value}' --output table

# List all stack resources
aws cloudformation list-stack-resources \
  --stack-name myapp-production \
  --query 'StackResourceSummaries[*].{Logical:LogicalResourceId,Physical:PhysicalResourceId,Status:ResourceStatus}' \
  --output table
\`\`\`

> **Tip:** Always use **change sets** in production — never \`update-stack\` directly. A change set is like \`terraform plan\`: review exactly what will be created, modified, or deleted before committing. The few seconds it takes saves hours of incident response.`,
        },
        {
          id: "codepipeline",
          title: "CodePipeline & CodeBuild",
          description: "Build a CI/CD pipeline with CodePipeline, CodeBuild, and automated deployments.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create a CodeBuild project to build and test code",
            "Wire CodePipeline with GitHub, CodeBuild, and ECS deployment",
            "Add manual approval gates for production deployments",
            "Monitor pipeline executions via CLI",
          ],
          content: `## CodePipeline & CodeBuild

AWS CodePipeline orchestrates CI/CD workflows. CodeBuild provides managed build environments.

---

## CodeBuild Project

\`\`\`bash
# buildspec.yml — lives in your repository root
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci

  pre_build:
    commands:
      - echo Logging in to ECR...
      - aws ecr get-login-password --region \$AWS_DEFAULT_REGION
          | docker login --username AWS --password-stdin \$ECR_REGISTRY
      - npm run lint
      - npm test

  build:
    commands:
      - docker build -t \$IMAGE_REPO_NAME:\$IMAGE_TAG .
      - docker tag \$IMAGE_REPO_NAME:\$IMAGE_TAG \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG

  post_build:
    commands:
      - docker push \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG
      - printf '[{"name":"myapp","imageUri":"%s"}]' \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
\`\`\`

\`\`\`bash
# Create CodeBuild project
aws codebuild create-project \
  --name myapp-build \
  --source '{
    "type": "GITHUB",
    "location": "https://github.com/myorg/myapp",
    "buildspec": "buildspec.yml"
  }' \
  --environment '{
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/standard:7.0",
    "computeType": "BUILD_GENERAL1_SMALL",
    "privilegedMode": true,
    "environmentVariables": [
      {"name":"ECR_REGISTRY","value":"123456789012.dkr.ecr.us-east-1.amazonaws.com","type":"PLAINTEXT"},
      {"name":"IMAGE_REPO_NAME","value":"myapp","type":"PLAINTEXT"},
      {"name":"IMAGE_TAG","value":"latest","type":"PLAINTEXT"},
      {"name":"DB_PASSWORD","value":"/myapp/db_password","type":"PARAMETER_STORE"}
    ]
  }' \
  --service-role arn:aws:iam::123456789012:role/CodeBuildServiceRole \
  --artifacts '{"type":"NO_ARTIFACTS"}'
\`\`\`

---

## CodePipeline

\`\`\`bash
# pipeline.json
{
  "pipeline": {
    "name": "myapp-pipeline",
    "roleArn": "arn:aws:iam::123456789012:role/CodePipelineRole",
    "artifactStore": {
      "type": "S3",
      "location": "my-pipeline-artifacts-123456789012"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [{
          "name": "GitHub",
          "actionTypeId": {
            "category": "Source",
            "owner": "ThirdParty",
            "provider": "GitHub",
            "version": "1"
          },
          "configuration": {
            "Owner": "myorg",
            "Repo": "myapp",
            "Branch": "main",
            "OAuthToken": "{{resolve:secretsmanager:github-token}}"
          },
          "outputArtifacts": [{"name": "SourceOutput"}]
        }]
      },
      {
        "name": "Build",
        "actions": [{
          "name": "CodeBuild",
          "actionTypeId": {
            "category": "Build",
            "owner": "AWS",
            "provider": "CodeBuild",
            "version": "1"
          },
          "inputArtifacts": [{"name": "SourceOutput"}],
          "outputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {"ProjectName": "myapp-build"}
        }]
      },
      {
        "name": "Approval",
        "actions": [{
          "name": "ProductionApproval",
          "actionTypeId": {
            "category": "Approval",
            "owner": "AWS",
            "provider": "Manual",
            "version": "1"
          },
          "configuration": {
            "NotificationArn": "arn:aws:sns:us-east-1:123456789012:deployments",
            "CustomData": "Please review the staging environment before approving."
          }
        }]
      },
      {
        "name": "Deploy",
        "actions": [{
          "name": "ECS",
          "actionTypeId": {
            "category": "Deploy",
            "owner": "AWS",
            "provider": "ECS",
            "version": "1"
          },
          "inputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {
            "ClusterName": "production",
            "ServiceName": "myapp",
            "FileName": "imagedefinitions.json"
          }
        }]
      }
    ]
  }
}

# Create the pipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
\`\`\`

---

## Pipeline CLI Operations

\`\`\`bash
# Trigger a pipeline manually
aws codepipeline start-pipeline-execution --name myapp-pipeline

# Get pipeline state
aws codepipeline get-pipeline-state --name myapp-pipeline \
  --query 'stageStates[*].{Stage:stageName,Status:latestExecution.status}'

# List recent executions
aws codepipeline list-pipeline-executions --pipeline-name myapp-pipeline \
  --query 'pipelineExecutionSummaries[0:5].{ID:pipelineExecutionId,Status:status,Started:startTime}'

# Approve a manual gate
APPROVAL=$(aws codepipeline get-pipeline-state --name myapp-pipeline \
  --query 'stageStates[?stageName==\`Approval\`].actionStates[0].latestExecution.token' \
  --output text)

aws codepipeline put-approval-result \
  --pipeline-name myapp-pipeline \
  --stage-name Approval \
  --action-name ProductionApproval \
  --result '{"summary":"LGTM — staging verified","status":"Approved"}' \
  --token \$APPROVAL
\`\`\``,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 7 — Monitoring, Security & Cost
    // ─────────────────────────────────────────
    {
      id: "aws-monitoring-security",
      title: "Monitoring, Security & Cost",
      description: "CloudWatch, CloudTrail, GuardDuty, Config, Cost Explorer, and Budgets.",
      level: "intermediate",
      lessons: [
        {
          id: "cloudwatch",
          title: "CloudWatch Monitoring",
          description: "Metrics, alarms, dashboards, log insights, and composite alarms.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Create CloudWatch alarms for EC2, RDS, and Lambda",
            "Query logs with CloudWatch Logs Insights",
            "Build a CloudWatch dashboard via CLI",
            "Set up anomaly detection alarms",
          ],
          content: `## CloudWatch Monitoring

CloudWatch is the native AWS observability service — metrics, logs, alarms, and dashboards.

---

## Creating Alarms

\`\`\`bash
# EC2 CPU alarm → SNS notification
aws cloudwatch put-metric-alarm \
  --alarm-name "ec2-high-cpu" \
  --alarm-description "EC2 CPU > 80% for 5 minutes" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistic Average \
  --period 60 \
  --evaluation-periods 5 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --ok-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --treat-missing-data notBreaching

# Lambda error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "lambda-error-rate" \
  --metrics '[
    {"Id":"errors","MetricStat":{"Metric":{"Namespace":"AWS/Lambda","MetricName":"Errors","Dimensions":[{"Name":"FunctionName","Value":"my-function"}]},"Period":60,"Stat":"Sum"}},
    {"Id":"invocations","MetricStat":{"Metric":{"Namespace":"AWS/Lambda","MetricName":"Invocations","Dimensions":[{"Name":"FunctionName","Value":"my-function"}]},"Period":60,"Stat":"Sum"}},
    {"Id":"errorRate","Expression":"errors/invocations*100","Label":"Error Rate %"}
  ]' \
  --comparison-operator GreaterThanThreshold \
  --threshold 5 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts

# RDS freeable memory alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "rds-low-memory" \
  --metric-name FreeableMemory \
  --namespace AWS/RDS \
  --dimensions Name=DBInstanceIdentifier,Value=my-aurora-writer \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 256000000 \
  --comparison-operator LessThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts
\`\`\`

---

## CloudWatch Logs Insights

\`\`\`bash
# Query Lambda errors
aws logs start-query \
  --log-group-name /aws/lambda/my-function \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string '
    fields @timestamp, @message
    | filter @message like /ERROR/
    | sort @timestamp desc
    | limit 50
  '

# Get the query results
aws logs get-query-results --query-id <query-id>

# P99 latency for API Gateway
aws logs start-query \
  --log-group-name /aws/apigateway/my-api \
  --start-time $(date -d '24 hours ago' +%s) \
  --end-time $(date +%s) \
  --query-string '
    fields @timestamp, responseLatency
    | stats
      count(*) as requests,
      avg(responseLatency) as p50,
      percentile(responseLatency, 95) as p95,
      percentile(responseLatency, 99) as p99
      by bin(5m)
  '
\`\`\`

---

## Custom Metrics

\`\`\`bash
# Push a custom metric from application code
aws cloudwatch put-metric-data \
  --namespace "MyApp/Orders" \
  --metric-name OrdersProcessed \
  --value 42 \
  --unit Count \
  --dimensions Environment=production,Region=us-east-1

# From a script
for i in {1..5}; do
  aws cloudwatch put-metric-data \
    --namespace "MyApp/Queue" \
    --metric-name QueueDepth \
    --value $(redis-cli llen orders_queue) \
    --unit Count
  sleep 60
done
\`\`\`

---

## CloudWatch Dashboard

\`\`\`bash
aws cloudwatch put-dashboard \
  --dashboard-name "Production-Overview" \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "x": 0, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "EC2 CPU Utilization",
          "metrics": [["AWS/EC2","CPUUtilization","AutoScalingGroupName","my-app-asg"]],
          "period": 60,
          "stat": "Average",
          "view": "timeSeries"
        }
      },
      {
        "type": "alarm",
        "x": 12, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "Active Alarms",
          "alarms": [
            "arn:aws:cloudwatch:us-east-1:123456789012:alarm:ec2-high-cpu",
            "arn:aws:cloudwatch:us-east-1:123456789012:alarm:rds-low-memory"
          ]
        }
      }
    ]
  }'
\`\`\``,
        },
        {
          id: "security-and-cost",
          title: "Security Services & Cost Management",
          description: "GuardDuty, Security Hub, Config, Cost Explorer, and Budgets.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Enable GuardDuty and investigate findings",
            "Set up AWS Config rules for compliance checking",
            "Analyse costs with Cost Explorer CLI",
            "Create Budget alerts to prevent cost overruns",
          ],
          content: `## Security Services & Cost Management

AWS provides native security services and cost management tools that integrate with your DevOps workflows.

---

## GuardDuty — Threat Detection

GuardDuty analyses CloudTrail, VPC Flow Logs, and DNS logs with ML to detect threats.

\`\`\`bash
# Enable GuardDuty
DETECTOR_ID=$(aws guardduty create-detector \
  --enable \
  --finding-publishing-frequency FIFTEEN_MINUTES \
  --query 'DetectorId' --output text)

echo "Detector ID: \$DETECTOR_ID"

# List findings (filter to HIGH)
aws guardduty list-findings \
  --detector-id \$DETECTOR_ID \
  --finding-criteria '{
    "Criterion": {
      "severity": {"Gte": 7}
    }
  }'

# Get finding details
aws guardduty get-findings \
  --detector-id \$DETECTOR_ID \
  --finding-ids <finding-id> \
  --query 'Findings[0].{Title:Title,Severity:Severity,Type:Type,Description:Description}'

# Archive a finding (after investigation)
aws guardduty archive-findings \
  --detector-id \$DETECTOR_ID \
  --finding-ids <finding-id>

# Sample common finding types:
# UnauthorizedAccess:EC2/SSHBruteForce
# Recon:EC2/PortProbeUnprotectedPort
# CryptoCurrency:EC2/BitcoinTool.B!DNS
# PrivilegeEscalation:IAMUser/AnomalousBehavior
\`\`\`

---

## AWS Config — Compliance Rules

Config continuously records AWS resource configurations and evaluates them against rules.

\`\`\`bash
# Enable Config recorder
aws configservice put-configuration-recorder \
  --configuration-recorder '{
    "name": "default",
    "roleARN": "arn:aws:iam::123456789012:role/ConfigRole",
    "recordingGroup": {
      "allSupported": true,
      "includeGlobalResourceTypes": true
    }
  }'

aws configservice put-delivery-channel \
  --delivery-channel '{
    "name": "default",
    "s3BucketName": "my-config-bucket",
    "configSnapshotDeliveryProperties": {"deliveryFrequency": "TwentyFour_Hours"}
  }'

aws configservice start-configuration-recorder --configuration-recorder-name default

# Add managed rules
aws configservice put-config-rule \
  --config-rule '{
    "ConfigRuleName": "s3-bucket-public-read-prohibited",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"
    }
  }'

aws configservice put-config-rule \
  --config-rule '{
    "ConfigRuleName": "encrypted-volumes",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "ENCRYPTED_VOLUMES"
    }
  }'

# Check compliance
aws configservice describe-compliance-by-config-rule \
  --query 'ComplianceByConfigRules[*].{Rule:ConfigRuleName,Compliance:Compliance.ComplianceType}' \
  --output table

# Get non-compliant resources
aws configservice get-compliance-details-by-config-rule \
  --config-rule-name s3-bucket-public-read-prohibited \
  --compliance-types NON_COMPLIANT
\`\`\`

---

## Cost Explorer & Budgets

\`\`\`bash
# Get cost breakdown by service for last month
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[*].{Service:Keys[0],Cost:Metrics.UnblendedCost.Amount}' \
  --output table | sort -k2 -rn

# Get cost by tag (requires cost allocation tags enabled)
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=TAG,Key=Environment \
  --query 'ResultsByTime[0].Groups[*].{Env:Keys[0],Cost:Metrics.UnblendedCost.Amount}'

# Get rightsizing recommendations
aws ce get-rightsizing-recommendation \
  --service EC2 \
  --configuration '{"RecommendationTarget":"SAME_INSTANCE_FAMILY","BenefitsConsidered":true}' \
  --query 'RightsizingRecommendations[0:5].{
    Instance:CurrentInstance.ResourceId,
    Savings:RightsizingType,
    Estimated:EstimatedMonthlySavings
  }'

# Create a budget with alert
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "monthly-spending",
    "BudgetLimit": {"Amount": "1000", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "devops@mycompany.com"
    }]
  }]'

# Spot savings analysis
aws ce get-savings-plans-purchase-recommendation \
  --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR \
  --payment-option NO_UPFRONT \
  --lookback-period-in-days THIRTY_DAYS \
  --query 'SavingsPlansPurchaseRecommendation.SavingsPlansRecommendationDetails[0:3].{
    EstimatedROI:EstimatedROI,
    EstimatedSavings:EstimatedSavingsAmount,
    Commitment:HourlyCommitmentToPurchase
  }'
\`\`\`

> **Tip:** Enable **AWS Compute Optimizer** — it analyses EC2, ECS, Lambda, and EBS usage and recommends right-sized replacements. Typical savings are 20–40% for workloads that were initially over-provisioned. It's free to enable and recommendations are updated weekly.`,
        },
      ],
    },
  ],
};
