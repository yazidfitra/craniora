#!/bin/bash
# Deploy Craniora Academy ke VPS
# Jalankan di VPS: bash deploy.sh

set -e

APP_DIR="/var/www/craniora"
REPO="https://github.com/yazidfitra/craniora.git"

echo "=== Deploying Craniora Academy ==="

# Clone atau pull repo
if [ -d "$APP_DIR" ]; then
  echo ">> Pulling latest changes..."
  cd $APP_DIR
  git pull origin main
else
  echo ">> Cloning repository..."
  git clone $REPO $APP_DIR
  cd $APP_DIR
fi

# Install dependencies
echo ">> Installing dependencies..."
npm install --production=false

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
  echo ">> Creating .env.local (EDIT THIS FILE!)"
  cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://supabase.craniora.academy
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
EOF
  echo "!! IMPORTANT: Edit .env.local with your actual keys!"
  echo "!! Run: nano $APP_DIR/.env.local"
fi

# Build
echo ">> Building Next.js..."
npm run build

# Setup PM2
echo ">> Starting with PM2..."
pm2 delete craniora 2>/dev/null || true
pm2 start npm --name "craniora" -- start -- -p 3000
pm2 save

echo ""
echo "=== Deploy Complete ==="
echo "App running on port 3000"
echo "Make sure Nginx proxies to localhost:3000"
echo ""
