Write-Host "🚀 Installing dependencies..."
pnpm install

if (-not (Test-Path "packages/backend-common/.env")) {
    Write-Host "📄 Creating .env file..."
    Copy-Item "packages/backend-common/.env.example" "packages/backend-common/.env"
}

Set-Location "packages/db"

Write-Host "🔧 Generating Prisma Client..."
npx prisma generate

Write-Host "🐳 Starting Docker containers..."
docker compose up -d

Write-Host "⏳ Waiting for database..."
Start-Sleep -Seconds 10

Write-Host "🗄️ Running migrations..."
npx prisma migrate dev

Set-Location ../..

Write-Host ""
Write-Host "🎉 Project setup completed!"
Write-Host "Run: pnpm dev"