#!/bin/bash

# Build script for React frontend
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

print_status "Starting frontend build..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run tests
print_status "Running tests..."
npm test -- --coverage --watchAll=false

# Build the application
print_status "Building React application..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    print_status "Build completed successfully!"
    print_status "Build output is in the 'build' directory"
    
    # Display build size
    BUILD_SIZE=$(du -sh build | cut -f1)
    print_status "Build size: $BUILD_SIZE"
else
    print_error "Build failed - build directory not found"
    exit 1
fi

print_status "Frontend build completed successfully!"
