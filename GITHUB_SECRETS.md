# GitHub Secrets Configuration Guide

This document lists all the GitHub Secrets that need to be configured for the CI/CD pipeline to work properly.

## Required Secrets

### Docker Hub Credentials
- `DOCKER_USER` - Your Docker Hub username
- `DOCKER_PAT` - Your Docker Hub Personal Access Token (PAT)
  - Create at: https://hub.docker.com/settings/security
  - Required scopes: Read, Write, Delete

### OCI (Oracle Cloud Infrastructure) Configuration
- `OCI_TENANCY_OCID` - Your OCI tenancy OCID
- `OCI_USER_OCID` - Your OCI user OCID
- `OCI_FINGERPRINT` - Your OCI API key fingerprint
- `OCI_PRIVATE_KEY` - Your OCI API private key (PEM format)
- `OCI_REGION` - Your OCI region (e.g., `us-ashburn-1`)
- `OCI_COMPARTMENT_OCID` - Your OCI compartment OCID
- `OCI_SUBNET_ID` - Your OCI subnet ID
- `OCI_AVAILABILITY_DOMAIN` - Your OCI availability domain
- `OCI_UBUNTU_IMAGE_OCID` - Ubuntu 22.04 image OCID for your region

### VM SSH Keys
- `VM_SSH_PUBLIC_KEY` - SSH public key for VM access
- `VM_SSH_PRIVATE_KEY` - SSH private key for VM access (PEM format)

### Application Environment Variables (Build Time)
These are baked into the Docker image during build:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Application Environment Variables (Runtime)
These are passed to the container at runtime:
- `DATABASE_URL` - Your PostgreSQL database connection string
  - Format: `postgresql://user:password@host:port/database`

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value
5. Click **Add secret**

## Testing Secrets

After adding all secrets, you can test them by:

1. **Manual Workflow Trigger:**
   - Go to Actions tab
   - Select "Build and Publish Docker Image"
   - Click "Run workflow"
   - Check if the build succeeds

2. **Push a Test Commit:**
   - Make a small change to README.md
   - Push to main branch
   - Monitor both workflows in Actions tab

## Security Best Practices

- ✅ Never commit secrets to the repository
- ✅ Rotate secrets periodically (especially SSH keys and PATs)
- ✅ Use different credentials for production and development
- ✅ Limit access to GitHub repository settings
- ✅ Review Actions logs carefully (secrets are masked)

## Notes

- Make sure all secrets are properly formatted (no extra spaces or newlines)
- For multi-line secrets like `OCI_PRIVATE_KEY` and `VM_SSH_PRIVATE_KEY`, paste the entire key including headers:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  ... key content ...
  -----END RSA PRIVATE KEY-----
  ```
- Test your deployment after adding all secrets
- If a secret is updated, re-run the workflow for changes to take effect

## Troubleshooting

### Build Fails with Environment Variable Errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Check that they don't have extra quotes or spaces

### Deployment Fails to Connect to VM
- Check `VM_SSH_PRIVATE_KEY` format (must be complete PEM format)
- Verify the public key matches the private key
- Ensure the public key is added to the VM during Terraform provisioning

### Container Fails to Start
- Verify `DATABASE_URL` is correct
- Check that Supabase credentials are valid
- Review container logs on the VM
