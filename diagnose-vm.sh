#!/bin/bash
# Diagnostic script to check VM and application status
# Usage: ./diagnose-vm.sh <VM_IP> <PATH_TO_SSH_KEY>

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./diagnose-vm.sh <VM_IP> <PATH_TO_SSH_KEY>"
  echo "Example: ./diagnose-vm.sh 123.45.67.89 ~/.ssh/oci_vm_key"
  exit 1
fi

VM_IP=$1
SSH_KEY=$2

echo "=========================================="
echo "VM Diagnostics for: $VM_IP"
echo "=========================================="

# Test SSH connection
echo "1. Testing SSH connection..."
if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=5 ubuntu@"$VM_IP" "echo 'SSH OK'" 2>/dev/null; then
  echo "✅ SSH connection successful"
else
  echo "❌ SSH connection failed"
  exit 1
fi

# Run diagnostics on VM
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@"$VM_IP" << 'ENDSSH'
  echo ""
  echo "=========================================="
  echo "2. System Information"
  echo "=========================================="
  uname -a
  uptime
  
  echo ""
  echo "=========================================="
  echo "3. Docker Status"
  echo "=========================================="
  sudo docker --version || echo "❌ Docker not installed"
  sudo docker compose version || echo "❌ Docker Compose not installed"
  sudo systemctl status docker --no-pager | head -n 10
  
  echo ""
  echo "=========================================="
  echo "4. Running Containers"
  echo "=========================================="
  sudo docker ps -a
  
  echo ""
  echo "=========================================="
  echo "5. Docker Compose Status"
  echo "=========================================="
  if [ -f ~/docker-compose.yml ]; then
    echo "✅ docker-compose.yml exists"
    echo "Content:"
    cat ~/docker-compose.yml
    echo ""
    sudo docker compose ps 2>/dev/null || echo "No compose services running"
  else
    echo "❌ docker-compose.yml not found"
  fi
  
  echo ""
  echo "=========================================="
  echo "6. Environment Variables in Container"
  echo "=========================================="
  CONTAINER_ID=$(sudo docker ps -q --filter "name=univalle-nextjs" | head -n1)
  if [ -n "$CONTAINER_ID" ]; then
    echo "Container found: $CONTAINER_ID"
    echo "NEXT_PUBLIC_URL:"
    sudo docker exec "$CONTAINER_ID" printenv NEXT_PUBLIC_URL 2>/dev/null || echo "Not set"
    echo ""
    echo "NODE_ENV:"
    sudo docker exec "$CONTAINER_ID" printenv NODE_ENV 2>/dev/null || echo "Not set"
    echo ""
    echo "All NEXT_PUBLIC_* variables:"
    sudo docker exec "$CONTAINER_ID" printenv | grep NEXT_PUBLIC || echo "None found"
  else
    echo "No container running"
  fi
  
  echo ""
  echo "=========================================="
  echo "7. Application Logs (last 50 lines)"
  echo "=========================================="
  if [ -f ~/docker-compose.yml ]; then
    sudo docker compose logs --tail=50 2>/dev/null || echo "No logs available"
  else
    echo "docker-compose.yml not found, checking container logs directly..."
    CONTAINER_ID=$(sudo docker ps -q --filter "name=univalle-nextjs" | head -n1)
    if [ -n "$CONTAINER_ID" ]; then
      sudo docker logs --tail=50 "$CONTAINER_ID"
    else
      echo "No container found"
    fi
  fi
  
  echo ""
  echo "=========================================="
  echo "8. Port Status"
  echo "=========================================="
  echo "Listening ports:"
  sudo netstat -tulpn 2>/dev/null || sudo ss -tulpn
  echo ""
  echo "Port 80 status:"
  sudo netstat -tulpn 2>/dev/null | grep :80 || sudo ss -tulpn | grep :80 || echo "⚠️ Port 80 not listening"
  
  echo ""
  echo "=========================================="
  echo "9. Firewall/iptables Status"
  echo "=========================================="
  sudo iptables -L -n -v | head -n 20 || echo "Could not check iptables"
  
  echo ""
  echo "=========================================="
  echo "10. Cloud-init Status"
  echo "=========================================="
  
  echo "Cloud-init overall status:"
  sudo cloud-init status || echo "cloud-init status command not available"
  
  echo ""
  echo "Cloud-init detailed status:"
  sudo cloud-init status --long 2>/dev/null || echo "Could not get detailed status"
  
  echo ""
  if [ -f /var/lib/cloud/instance/docker-ready ]; then
    echo "✅ Docker installation completed"
  else
    echo "⚠️ Docker installation marker not found"
  fi
  
  if [ -f /var/log/cloud-init-docker.log ]; then
    echo ""
    echo "Last 50 lines of cloud-init Docker installation log:"
    sudo tail -n 50 /var/log/cloud-init-docker.log
  else
    echo "No cloud-init Docker log found"
  fi
  
  echo ""
  echo "Cloud-init output log (errors):"
  sudo tail -n 20 /var/log/cloud-init-output.log 2>/dev/null || echo "No cloud-init output log"
  
  echo ""
  echo "=========================================="
  echo "11. Disk Space"
  echo "=========================================="
  df -h
  
  echo ""
  echo "=========================================="
  echo "12. Memory Usage"
  echo "=========================================="
  free -h
  
  echo ""
  echo "=========================================="
  echo "13. Testing localhost connection"
  echo "=========================================="
  curl -v http://localhost:80 2>&1 | head -n 20 || echo "Cannot connect to localhost:80"
ENDSSH

echo ""
echo "=========================================="
echo "14. Testing external connection from this machine"
echo "=========================================="
if curl -v -m 10 http://"$VM_IP" 2>&1 | head -n 30; then
  echo "✅ Successfully connected to http://$VM_IP"
else
  echo "❌ Cannot connect to http://$VM_IP"
  echo ""
  echo "Possible issues:"
  echo "- OCI Security List doesn't allow inbound traffic on port 80"
  echo "- Application not running or crashed"
  echo "- Docker container not properly exposing port 80"
fi

echo ""
echo "=========================================="
echo "Diagnostics completed!"
echo "=========================================="
