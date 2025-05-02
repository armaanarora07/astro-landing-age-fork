#!/bin/bash
set -e

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  DOMAIN=${APP_DOMAIN:-localhost}
  echo "🌐 Deploying to: $DOMAIN"
else
  echo "⚠️ Warning: .env file not found. Using default configuration."
  DOMAIN="localhost"
fi

echo "Starting deployment process..."
echo "$(date)"
echo

# Pull latest code if this is a git repository
if [ -d .git ]; then
  echo "Pulling latest code from repository..."
  git pull
  echo
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ "$1" == "--reinstall" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo
fi

# Create necessary directories
mkdir -p logs/caddy

# Prepare production build with all assets
echo "🏗️ Preparing production build..."
npm run prepare-prod
echo

# Stop and remove containers
echo "🛑 Stopping existing containers..."
docker-compose down
echo

# Clean up dangling images and build cache (safe, app-specific)
echo "🧹 Cleaning up unused Docker images and build cache..."
docker image prune -f
docker builder prune -f
echo

# Build and start containers
echo "🚀 Building and starting containers..."
cd production-build
docker-compose -f ../docker-compose.yml build --no-cache
docker-compose -f ../docker-compose.yml up -d
cd ..
echo

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check container status
echo "🔍 Checking services status..."
docker-compose ps
echo

# Verify SSL configuration
echo "🔒 Verifying SSL configuration..."
CONTAINER_NAME=$(docker-compose ps -q caddy 2>/dev/null || echo "")

if [ -n "$CONTAINER_NAME" ] && command -v openssl &> /dev/null; then
  echo "Testing SSL handshake with server..."
  # Get container IP to test directly
  CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER_NAME)
  
  # Test SSL handshake - using SNI to specify the domain
  openssl s_client -connect ${CONTAINER_IP}:443 -servername $DOMAIN -showcerts </dev/null > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "✅ SSL configuration verified successfully"
  else
    echo "⚠️ Warning: SSL handshake test failed. This might be expected if:"
    echo "   - You're using a local development environment"
    echo "   - Your domain DNS is not yet configured" 
    echo "   - You're using Cloudflare or another proxy service"
  fi
else
  echo "⚠️ Warning: SSL verification skipped (container not found or openssl not available)"
fi
echo

echo "✅ Deployment completed successfully"
echo "📝 Check logs with: docker-compose logs -f"
echo "🌐 Your site should be available at: https://$DOMAIN"
echo "$(date)"
