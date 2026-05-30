#!/bin/bash

set -e

echo "🚀 Installing dependencies..."
pnpm install

if [ ! -f "packages/backend-common/.env" ]; then
    echo "📄 Creating .env file..."
    cp packages/backend-common/.env.example packages/backend-common/.env
    echo "⚠️  Please review packages/backend-common/.env"
fi

cd packages/db

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "🐳 Starting Docker containers..."
docker compose up -d

echo "⏳ Waiting for database..."
sleep 10

echo "🗄️ Running migrations..."
npx prisma migrate dev

cd ../..

echo ""
echo "🎉 Project setup completed!"
echo ""
echo "Next steps:"
echo "1. Verify .env values"
echo "2. Run: pnpm dev"