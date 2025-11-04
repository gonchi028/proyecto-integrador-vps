#!/bin/bash
# Script de cloud-init para instalar Docker y Docker Compose en Ubuntu 22.04

set -e  # Exit on any error

# Log file for debugging
LOG_FILE="/var/log/cloud-init-docker.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

echo "=========================================="
echo "Starting Docker installation at $(date)"
echo "=========================================="

# 1. Actualizar paquetes
echo "Step 1: Updating packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Instalar dependencias necesarias
echo "Step 2: Installing dependencies..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. Configurar repositorio de Docker
echo "Step 3: Setting up Docker repository..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Instalar Docker
echo "Step 4: Installing Docker..."
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Añadir el usuario por defecto (ubuntu) al grupo docker
echo "Step 5: Adding ubuntu user to docker group..."
if id -u ubuntu >/dev/null 2>&1; then
    sudo usermod -aG docker ubuntu
    echo "✅ User 'ubuntu' added to docker group"
else
    echo "⚠️ User 'ubuntu' not found"
fi

# 6. Habilitar y arrancar el servicio Docker
echo "Step 6: Starting Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# 7. Verificar instalación
echo "Step 7: Verifying Docker installation..."
if sudo docker --version; then
    echo "✅ Docker installed successfully: $(sudo docker --version)"
else
    echo "❌ Docker installation failed"
    exit 1
fi

if sudo docker compose version; then
    echo "✅ Docker Compose installed successfully: $(sudo docker compose version)"
else
    echo "❌ Docker Compose installation failed"
    exit 1
fi

# 8. Test Docker
echo "Step 8: Testing Docker..."
if sudo docker run --rm hello-world > /dev/null 2>&1; then
    echo "✅ Docker is working correctly"
else
    echo "⚠️ Docker test failed, but continuing..."
fi

# 9. Create marker file to indicate completion
echo "Step 9: Creating completion marker..."
sudo touch /var/lib/cloud/instance/docker-ready
echo "✅ Docker installation completed successfully at $(date)"

echo "=========================================="
echo "Installation Summary:"
echo "Docker Version: $(sudo docker --version)"
echo "Docker Compose Version: $(sudo docker compose version)"
echo "=========================================="
