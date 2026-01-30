# Deployment Guide

## Overview

This guide covers deploying the Task Manager application to AWS using the Serverless Framework and GitHub Actions CI/CD pipeline.

## Prerequisites

### Required Tools

- Node.js 18.x or higher
- AWS CLI configured with appropriate permissions
- Serverless Framework CLI
- Git
- GitHub account

### AWS Permissions

Your AWS user/role needs the following permissions:

- Lambda (create, update, delete functions)
- API Gateway (create, update, delete APIs)
- DynamoDB (create, update, delete tables)
- Cognito (create, update, delete user pools)
- S3 (create, update, delete buckets)
- CloudFront (create, update, delete distributions)
- IAM (create, update, delete roles and policies)
- CloudFormation (create, update, delete stacks)

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd serverless-task-manager
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (json)
```

### 4. Set Environment Variables

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
cp env.example .env
# Edit .env with your configuration
```

## Manual Deployment

### Backend Deployment

#### 1. Deploy to Development

```bash
cd backend
npm run deploy:dev
```

#### 2. Deploy to Production

```bash
npm run deploy:prod
```

#### 3. Using Deployment Script

```bash
# Make script executable (Linux/Mac)
chmod +x scripts/deploy.sh

# Deploy to development
./scripts/deploy.sh dev

# Deploy to production
./scripts/deploy.sh prod
```

### Frontend Deployment

#### 1. Build Application

```bash
cd frontend
npm run build
```

#### 2. Deploy to S3

```bash
# Get bucket name from backend deployment output
aws s3 sync build/ s3://your-bucket-name --delete
```

#### 3. Invalidate CloudFront

```bash
# Get distribution ID from backend deployment output
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## CI/CD Pipeline Setup

### 1. GitHub Repository Setup

#### Create Repository

1. Create a new GitHub repository
2. Push your code to the repository
3. Set up branch protection rules for master/main branch

#### Configure Secrets

Go to Repository Settings → Secrets and variables → Actions, and add:

```bash
# Development Environment
AWS_ACCESS_KEY_ID=your-dev-access-key
AWS_SECRET_ACCESS_KEY=your-dev-secret-key

# Production Environment
AWS_ACCESS_KEY_ID_PROD=your-prod-access-key
AWS_SECRET_ACCESS_KEY_PROD=your-prod-secret-key

# Frontend Deployment
S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-cloudfront-distribution-id
```

### 2. Pipeline Configuration

The CI/CD pipeline is configured in `.github/workflows/deploy.yml` and includes:

#### Stages

1. **Test**: Run backend and frontend tests
2. **Deploy Dev**: Deploy to development environment
3. **Deploy Prod**: Deploy to production environment
4. **Deploy Frontend**: Deploy React app to S3 + CloudFront

#### Triggers

- Push to master/main branch
- Pull requests to master/main branch

### 3. Pipeline Execution

#### Automatic Deployment

- Push to master/main branch triggers automatic deployment
- Pipeline runs tests, deploys backend, then frontend
- Deployment status is posted as GitHub comments

#### Manual Deployment

- Go to Actions tab in GitHub
- Select the workflow
- Click "Run workflow"
- Choose branch and run

## Environment Configuration

### Development Environment

```yaml
# serverless.yml
provider:
  stage: dev
  region: us-east-1
  environment:
    STAGE: dev
    TASKS_TABLE: task-manager-backend-tasks-dev
```

### Production Environment

```yaml
# serverless.yml
provider:
  stage: prod
  region: us-east-1
  environment:
    STAGE: prod
    TASKS_TABLE: task-manager-backend-tasks-prod
```

## Monitoring and Logging

### CloudWatch Logs

- Lambda function logs: `/aws/lambda/task-manager-backend-{stage}-{function-name}`
- API Gateway logs: `/aws/apigateway/task-manager-backend-{stage}`

### CloudWatch Metrics

- Request count and latency
- Error rates
- Throttle count

### X-Ray Tracing

Enable X-Ray tracing in `serverless.yml`:

```yaml
provider:
  tracing:
    lambda: true
    apiGateway: true
```

## Troubleshooting

### Common Deployment Issues

#### 1. Permission Errors

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify permissions
aws iam get-user
```

#### 2. Resource Conflicts

```bash
# Check existing resources
aws cloudformation list-stacks

# Delete conflicting resources
aws cloudformation delete-stack --stack-name stack-name
```

#### 3. Lambda Function Errors

```bash
# Check function logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/task-manager-backend"

# View recent logs
aws logs tail /aws/lambda/task-manager-backend-dev-createTask --follow
```

#### 4. API Gateway Issues

```bash
# Check API Gateway
aws apigateway get-rest-apis

# Test endpoints
curl -X GET https://your-api-gateway-url.amazonaws.com/dev/tasks
```

### Debugging Steps

1. **Check CloudWatch Logs**

   - Go to AWS Console → CloudWatch → Logs
   - Find your Lambda function log groups
   - Check for error messages

2. **Verify IAM Permissions**

   - Check if your AWS user has necessary permissions
   - Verify Lambda execution role permissions

3. **Test API Endpoints**

   - Use Postman or cURL to test endpoints
   - Check for CORS issues
   - Verify authentication

4. **Check DynamoDB**
   - Verify table exists
   - Check table permissions
   - Test table operations

## Rollback Procedures

### Backend Rollback

```bash
# List previous deployments
serverless deploy list --stage prod

# Rollback to previous version
serverless rollback --stage prod --timestamp timestamp
```

### Frontend Rollback

```bash
# Revert to previous build
git revert <commit-hash>
git push origin master
```

### Database Rollback

```bash
# Restore from backup (if available)
aws dynamodb restore-table-from-backup --target-table-name new-table --backup-arn backup-arn
```

## Security Considerations

### 1. Environment Variables

- Never commit sensitive data to version control
- Use AWS Systems Manager Parameter Store for sensitive configuration
- Rotate access keys regularly

### 2. IAM Permissions

- Follow principle of least privilege
- Use separate IAM users for different environments
- Enable MFA for production access

### 3. Network Security

- Use VPC for Lambda functions if needed
- Configure security groups properly
- Enable WAF for API Gateway

### 4. Data Protection

- Enable encryption at rest for DynamoDB
- Use HTTPS for all communications
- Implement proper backup strategies

## Performance Optimization

### 1. Lambda Functions

- Optimize cold start times
- Use provisioned concurrency for critical functions
- Monitor memory usage and adjust accordingly

### 2. API Gateway

- Enable caching for GET requests
- Use compression
- Monitor throttling

### 3. DynamoDB

- Use appropriate partition keys
- Implement proper indexing
- Monitor read/write capacity

### 4. CloudFront

- Configure appropriate TTL values
- Use compression
- Monitor cache hit rates

## Cost Optimization

### 1. Lambda Functions

- Right-size memory allocation
- Use appropriate timeout values
- Monitor execution costs

### 2. DynamoDB

- Use on-demand billing for variable workloads
- Implement proper indexing
- Monitor read/write capacity

### 3. API Gateway

- Monitor request counts
- Use appropriate caching
- Consider API Gateway usage plans

### 4. CloudFront

- Monitor data transfer costs
- Use appropriate cache behaviors
- Consider regional edge caches

## Backup and Recovery

### 1. DynamoDB Backups

```bash
# Enable point-in-time recovery
aws dynamodb update-continuous-backups --table-name table-name --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

# Create manual backup
aws dynamodb create-backup --table-name table-name --backup-name backup-name
```

### 2. Code Backups

- Use Git for version control
- Tag releases for easy rollback
- Maintain separate branches for different environments

### 3. Configuration Backups

- Export CloudFormation templates
- Backup environment variables
- Document deployment procedures

## Maintenance

### 1. Regular Updates

- Update dependencies regularly
- Monitor security advisories
- Apply security patches promptly

### 2. Monitoring

- Set up CloudWatch alarms
- Monitor error rates and latency
- Review logs regularly

### 3. Testing

- Run tests before deployment
- Use staging environment for testing
- Implement automated testing

### 4. Documentation

- Keep deployment documentation updated
- Document any custom configurations
- Maintain runbooks for common issues
