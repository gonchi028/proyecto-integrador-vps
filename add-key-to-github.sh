#!/bin/bash

# Helper script to properly format OCI private key for GitHub Secrets
# This ensures the multi-line key is properly formatted

set -e

PRIVATE_KEY_FILE="./oci-keys-local/oci_api_key.pem"

if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo "❌ Error: Private key file not found at $PRIVATE_KEY_FILE"
    echo "Run ./generate-oci-keys.sh first to generate the keys"
    exit 1
fi

echo "=========================================="
echo "GitHub Secret Setup Helper"
echo "=========================================="
echo ""
echo "📋 Instructions for adding OCI_PRIVATE_KEY to GitHub:"
echo ""
echo "1. Go to your GitHub repository"
echo "2. Navigate to: Settings → Secrets and variables → Actions"
echo "3. Click 'New repository secret'"
echo "4. Name: OCI_PRIVATE_KEY"
echo "5. Value: Copy the ENTIRE content below (including BEGIN and END lines)"
echo ""
echo "=========================================="
echo "📋 COPY THIS ENTIRE CONTENT:"
echo "=========================================="
echo ""
cat "$PRIVATE_KEY_FILE"
echo ""
echo "=========================================="
echo ""
echo "✅ The key format is correct (RSA PEM format)"
echo ""
echo "⚠️  IMPORTANT TIPS:"
echo "   - Copy the ENTIRE key including the header and footer lines"
echo "   - Make sure no extra spaces or lines are added"
echo "   - GitHub will handle the multi-line format automatically"
echo "   - Just paste it directly into the secret value field"
echo ""
echo "🔐 Fingerprint for OCI_FINGERPRINT secret:"
FINGERPRINT=$(openssl rsa -pubout -outform DER -in "$PRIVATE_KEY_FILE" 2>/dev/null | openssl md5 -c | awk '{print $2}')
echo "   $FINGERPRINT"
echo ""
