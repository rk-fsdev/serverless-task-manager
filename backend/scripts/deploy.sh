#!/bin/bash

# Deploy script for serverless backend
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if stage is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <stage>"
    print_error "Example: $0 dev"
    exit 1
fi

STAGE=$1

print_status "Starting deployment to $STAGE stage..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI is not configured or credentials are invalid"
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    print_error "Serverless Framework is not installed"
    print_error "Install it with: npm install -g serverless"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run tests
print_status "Running tests..."
npm test

# Deploy
print_status "Deploying to $STAGE..."
serverless deploy --stage $STAGE --verbose

# Get deployment outputs
print_status "Getting deployment outputs..."
serverless info --stage $STAGE

print_status "Deployment to $STAGE completed successfully!"

# Display important information
print_status "Important endpoints and resources:"
echo "API Gateway URL: $(serverless info --stage $STAGE | grep 'endpoint:' | cut -d' ' -f2)"
echo "User Pool ID: $(serverless info --stage $STAGE | grep 'UserPoolId:' | cut -d' ' -f2)"
echo "User Pool Client ID: $(serverless info --stage $STAGE | grep 'UserPoolClientId:' | cut -d' ' -f2)"
echo "DynamoDB Table: $(serverless info --stage $STAGE | grep 'TasksTableName:' | cut -d' ' -f2)"
