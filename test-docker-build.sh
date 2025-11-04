#!/bin/bash

# Local Docker Build Test Script
# This script helps you test the Docker build locally before pushing to GitHub

set -e  # Exit on error

echo "🐳 Local Docker Build Test"
echo "=========================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with your environment variables"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Required environment variables not set"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Build the Docker image
echo "🔨 Building Docker image..."
docker build \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -t proyecto-integrador-restaurante:local \
    .

echo ""
echo "✅ Docker image built successfully!"
echo ""

# Ask if user wants to run the container
read -p "Do you want to run the container locally? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting container..."
    docker run -d \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
        -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
        -e DATABASE_URL="$DATABASE_URL" \
        -e NEXT_PUBLIC_URL="http://localhost:3000" \
        --name proyecto-integrador-test \
        proyecto-integrador-restaurante:local
    
    echo ""
    echo "✅ Container started!"
    echo "🌐 Application available at: http://localhost:3000"
    echo ""
    echo "To stop the container, run:"
    echo "  docker stop proyecto-integrador-test"
    echo "  docker rm proyecto-integrador-test"
    echo ""
    echo "To view logs, run:"
    echo "  docker logs -f proyecto-integrador-test"
fi
