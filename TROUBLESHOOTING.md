# 🔧 VM Deployment Troubleshooting Guide

## Common Issues and Solutions

### Issue: Application not accessible after deployment

#### 🔍 **Most Likely Cause: Missing Firewall Rules**

The **#1 reason** applications aren't accessible is missing OCI Security List rules. Your Terraform configuration now includes `security.tf` which creates these rules automatically.

**Solution:**
1. The new `security.tf` file has been added to your project
2. Run `terraform init` and `terraform apply` to add the security rules
3. This will open ports 22 (SSH), 80 (HTTP), and 443 (HTTPS)

---

## 📋 Manual Diagnostic Steps

### 1. Check OCI Security List (Most Important!)

In OCI Console:
1. Go to **Networking** → **Virtual Cloud Networks**
2. Click on your VCN
3. Click on **Security Lists**
4. Check if there's an **Ingress Rule** for:
   - **Source CIDR:** `0.0.0.0/0`
   - **Destination Port:** `80`
   - **Protocol:** `TCP`

**If this rule is missing, your app will NOT be accessible!**

To fix:
```bash
cd /path/to/your/project
terraform init
terraform apply
```

### 2. Run the Diagnostic Script

```bash
./diagnose-vm.sh <YOUR_VM_IP> ~/.ssh/oci_vm_key
```

This will check:
- SSH connectivity
- Docker installation
- Container status
- Port availability
- Application logs
- And more!

### 3. Manual SSH Diagnostics

SSH into your VM:
```bash
ssh -i ~/.ssh/oci_vm_key ubuntu@<YOUR_VM_IP>
```

Then run these commands:

#### Check Docker status:
```bash
sudo docker ps
sudo docker compose ps
```

#### Check application logs:
```bash
sudo docker compose logs --tail=100
```

#### Check if port 80 is listening:
```bash
sudo netstat -tulpn | grep :80
# or
sudo ss -tulpn | grep :80
```

#### Test localhost connection:
```bash
curl http://localhost:80
```

If localhost works but external doesn't → **Firewall issue!**

#### Restart the application:
```bash
cd ~
sudo docker compose down
sudo docker compose pull
sudo docker compose up -d
```

### 4. Check Cloud-init Logs

```bash
ssh -i ~/.ssh/oci_vm_key ubuntu@<YOUR_VM_IP>
sudo cat /var/log/cloud-init-docker.log
```

This shows if Docker was installed correctly.

---

## 🚀 Deployment Improvements Made

### 1. **Added Security Rules** (`security.tf`)
- Opens ports 22, 80, 443
- Allows ICMP (ping)
- This is the most critical fix!

### 2. **Improved Cloud-init Script**
- Better error handling
- Detailed logging to `/var/log/cloud-init-docker.log`
- Creates completion marker file
- Verifies Docker installation

### 3. **Enhanced GitHub Actions**
- Increased wait time for VM initialization (120 seconds)
- Added Docker verification step
- Improved deployment diagnostics
- Better error messages
- Shows container logs on failure

### 4. **Created Diagnostic Tool**
- `diagnose-vm.sh` - comprehensive VM diagnostics
- Checks all common issues
- Easy to run and understand

---

## 📝 Deployment Checklist

Before deploying:
- [ ] OCI Security List configured (or use new `security.tf`)
- [ ] GitHub Secrets configured:
  - `DOCKER_USER`
  - `DOCKER_PAT`
  - `VM_SSH_PRIVATE_KEY`
  - `VM_SSH_PUBLIC_KEY`
  - `OCI_*` credentials
  - Supabase credentials
- [ ] Subnet allows internet access

After deployment:
- [ ] Check GitHub Actions logs
- [ ] Wait 2-3 minutes for full initialization
- [ ] Run `./diagnose-vm.sh <IP> <SSH_KEY>`
- [ ] Check OCI Security List if still not accessible

---

## 🆘 Quick Fixes

### Application not starting:
```bash
ssh -i ~/.ssh/oci_vm_key ubuntu@<VM_IP>
sudo docker compose logs
sudo docker compose restart
```

### Port 80 not listening:
```bash
# Check if another process is using port 80
sudo netstat -tulpn | grep :80

# Restart docker
sudo systemctl restart docker
sudo docker compose up -d
```

### Pull latest changes:
```bash
ssh -i ~/.ssh/oci_vm_key ubuntu@<VM_IP>
sudo docker compose pull
sudo docker compose up -d
```

---

## 📞 Still Having Issues?

1. **Check GitHub Actions logs** - Look for error messages
2. **Run diagnostic script** - `./diagnose-vm.sh <IP> <KEY>`
3. **Verify security list** - Most common issue!
4. **Check container logs** - `sudo docker compose logs`
5. **Try localhost** - If it works, it's a firewall issue

---

## 🔄 To Redeploy

### Via GitHub Actions:
Just push to `main` branch or trigger manually:
- Go to GitHub Actions tab
- Click "Build, Deploy Infrastructure and Next.js App"
- Click "Run workflow"

### Manually:
```bash
ssh -i ~/.ssh/oci_vm_key ubuntu@<VM_IP>
cd ~
sudo docker compose pull
sudo docker compose up -d --force-recreate
```

---

## 📌 Important Notes

1. **Security List is Critical**: Without proper ingress rules on port 80, the app will never be accessible from the internet
2. **Wait Time**: New VMs need 2-3 minutes to fully initialize
3. **Logs are Your Friend**: Always check `sudo docker compose logs` when troubleshooting
4. **Test Localhost First**: If `curl localhost:80` works but external doesn't, it's definitely a firewall issue
