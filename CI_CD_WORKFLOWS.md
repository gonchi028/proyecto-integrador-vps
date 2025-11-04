# CI/CD Workflows Documentation

This project uses GitHub Actions for continuous integration and deployment. The workflows are structured to ensure a smooth and reliable deployment process.

## Workflow Structure

### 1. Build and Publish Docker Image (`docker-publish.yml`)
**Trigger:** Runs on every push to `main` branch or manually via workflow_dispatch

**Steps:**
1. Checkout the repository
2. Set up Docker Buildx for optimized builds
3. Log in to Docker Hub
4. Build the Docker image with multi-stage build
5. Push the image to Docker Hub with two tags:
   - `latest` - Always points to the most recent build
   - `<commit-sha>` - Specific version for rollback capability

**Build Arguments:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (baked into the build)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (baked into the build)

**Output:** Docker image published to Docker Hub

---

### 2. Deploy Infrastructure and Application (`deploy.yml`)
**Trigger:** 
- Automatically runs after successful completion of `docker-publish.yml`
- Can be run manually via workflow_dispatch

**Jobs:**

#### Job 1: Check Build Status
- Verifies that the Docker build workflow completed successfully
- Prevents deployment of broken builds

#### Job 2: Provision OCI VM (Terraform)
- Creates or updates Oracle Cloud Infrastructure VM
- Installs Docker on the VM
- Configures security and networking
- Outputs the VM's public IP address

#### Job 3: Deploy Application
- Pulls the latest Docker image from Docker Hub
- Creates docker-compose.yml with runtime environment variables
- Deploys the application to the VM
- Performs health checks
- Cleans up old Docker images

**Runtime Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_URL` - Application URL (dynamically set to VM IP)

---

## Deployment Flow

```
┌─────────────────────────────────────┐
│  Push to main branch                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  docker-publish.yml                 │
│  • Build Docker image               │
│  • Run tests (in build)             │
│  • Push to Docker Hub               │
└──────────────┬──────────────────────┘
               │
               ▼ (on success)
┌─────────────────────────────────────┐
│  deploy.yml                         │
│  • Check build status               │
│  • Provision/update VM              │
│  • Deploy application               │
│  • Health check                     │
└─────────────────────────────────────┘
```

---

## Key Features

### 🔒 Security
- Secrets are stored in GitHub Secrets, never in code
- SSH keys are securely managed
- Docker images are built with minimal attack surface

### ⚡ Performance
- Multi-stage Docker builds reduce image size
- Build cache is used to speed up subsequent builds
- Only changed layers are rebuilt

### 🔄 Reliability
- Deployment only runs if build succeeds
- Health checks ensure application is running
- Old Docker images are automatically cleaned up
- Rollback capability via commit SHA tags

### 📊 Visibility
- Step summaries provide deployment status
- Links to application and Docker image
- Clear error messages if something fails

---

## Required GitHub Secrets

See `GITHUB_SECRETS.md` for the complete list of required secrets.

### Critical Secrets:
- `DOCKER_USER` - Docker Hub username
- `DOCKER_PAT` - Docker Hub Personal Access Token
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase key
- `DATABASE_URL` - Database connection string
- OCI credentials (for VM provisioning)
- SSH keys (for VM access)

---

## Manual Deployment

You can trigger deployments manually:

1. Go to **Actions** tab in GitHub
2. Select the workflow you want to run
3. Click **Run workflow**
4. Choose the branch (usually `main`)
5. Click **Run workflow**

---

## Troubleshooting

### Build Fails
- Check that all environment variables are set in GitHub Secrets
- Verify that the Dockerfile is correct
- Check build logs in GitHub Actions

### Deployment Fails
- Ensure VM is accessible via SSH
- Check that Docker is installed on the VM
- Verify that the Docker image was successfully pushed

### Application Not Responding
- Check Docker logs on the VM: `sudo docker logs univalle-nextjs-production`
- Verify environment variables are correct
- Check if the container is running: `sudo docker ps`

---

## Best Practices

1. **Always test locally first** before pushing to main
2. **Monitor the Actions tab** after pushing changes
3. **Check application health** after deployment
4. **Keep secrets updated** if credentials change
5. **Review logs** if something goes wrong

---

## Architecture

```
GitHub Repository (main branch)
    ↓
GitHub Actions Runner
    ↓
Docker Hub (image registry)
    ↓
OCI VM (Ubuntu 22.04)
    ↓
Docker Container (Next.js app)
    ↓
Internet (port 80)
```
