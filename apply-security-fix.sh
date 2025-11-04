#!/bin/bash
# Quick fix script to apply security rules and redeploy

set -e

echo "=========================================="
echo "🔧 Quick Fix: Apply Security Rules"
echo "=========================================="
echo ""

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed"
    echo "Please install Terraform first: https://www.terraform.io/downloads"
    exit 1
fi

echo "✅ Terraform found: $(terraform version | head -n1)"
echo ""

# Check if we're in the right directory
if [ ! -f "main.tf" ]; then
    echo "❌ main.tf not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "✅ Found main.tf"
echo ""

# Check if security.tf exists
if [ ! -f "security.tf" ]; then
    echo "❌ security.tf not found"
    echo "This file should have been created with the security rules"
    exit 1
fi

echo "✅ Found security.tf"
echo ""

# Initialize Terraform
echo "Step 1: Initializing Terraform..."
terraform init
echo ""

# Validate configuration
echo "Step 2: Validating Terraform configuration..."
if terraform validate; then
    echo "✅ Configuration is valid"
else
    echo "❌ Configuration validation failed"
    exit 1
fi
echo ""

# Show what will be created
echo "Step 3: Planning changes..."
terraform plan
echo ""

# Ask for confirmation
read -p "Do you want to apply these changes? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

# Apply changes
echo "Step 4: Applying changes..."
if terraform apply -auto-approve; then
    echo "✅ Security rules applied successfully!"
else
    echo "❌ Failed to apply changes"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Security rules have been applied!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Wait 1-2 minutes for rules to take effect"
echo "2. Try accessing your application again"
echo "3. If still not working, run: ./diagnose-vm.sh <VM_IP> <SSH_KEY>"
echo ""
