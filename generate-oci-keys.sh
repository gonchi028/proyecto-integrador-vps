#!/bin/bash

# Script to generate OCI API keys in the correct RSA PEM format
# This script creates keys that are compatible with Oracle Cloud Infrastructure

set -e

echo "=========================================="
echo "OCI API Key Generator"
echo "=========================================="
echo ""

# Create directory for keys
KEYS_DIR="./oci-keys-local"
mkdir -p "$KEYS_DIR"

echo "📁 Creating keys in: $KEYS_DIR"
echo ""

# Generate RSA private key in PEM format (required by OCI)
echo "🔑 Generating RSA private key (2048-bit)..."
openssl genrsa -out "$KEYS_DIR/oci_api_key.pem" 2048

# Set proper permissions on private key
chmod 600 "$KEYS_DIR/oci_api_key.pem"

# Generate public key from private key
echo "🔓 Generating public key..."
openssl rsa -pubout -in "$KEYS_DIR/oci_api_key.pem" -out "$KEYS_DIR/oci_api_key_public.pem"

# Generate fingerprint
echo "🔐 Generating fingerprint..."
FINGERPRINT=$(openssl rsa -pubout -outform DER -in "$KEYS_DIR/oci_api_key.pem" 2>/dev/null | openssl md5 -c | awk '{print $2}')

echo ""
echo "=========================================="
echo "✅ Keys generated successfully!"
echo "=========================================="
echo ""
echo "📂 Files created:"
echo "  - Private key: $KEYS_DIR/oci_api_key.pem"
echo "  - Public key:  $KEYS_DIR/oci_api_key_public.pem"
echo ""
echo "🔐 Fingerprint:"
echo "  $FINGERPRINT"
echo ""
echo "=========================================="
echo "📋 Next Steps:"
echo "=========================================="
echo ""
echo "1. Upload public key to OCI Console:"
echo "   - Go to: Identity & Security → Users → Your User"
echo "   - Click 'API Keys' → 'Add API Key'"
echo "   - Select 'Paste Public Key'"
echo "   - Copy and paste the content of:"
echo "     $KEYS_DIR/oci_api_key_public.pem"
echo ""
echo "2. Add to GitHub Secrets:"
echo "   Secret Name: OCI_PRIVATE_KEY"
echo "   Secret Value: Copy the entire content of:"
echo "     $KEYS_DIR/oci_api_key.pem"
echo ""
echo "3. Add fingerprint to GitHub Secrets:"
echo "   Secret Name: OCI_FINGERPRINT"
echo "   Secret Value: $FINGERPRINT"
echo ""
echo "=========================================="
echo ""
echo "🔍 To view the private key:"
echo "   cat $KEYS_DIR/oci_api_key.pem"
echo ""
echo "🔍 To view the public key:"
echo "   cat $KEYS_DIR/oci_api_key_public.pem"
echo ""
echo "⚠️  IMPORTANT: Keep the private key secure and never commit it to Git!"
echo "    The folder '$KEYS_DIR' should be in .gitignore"
echo ""
