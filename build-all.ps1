# build-all.ps1
# This script prepares the project for deployment by building both frontend and backend
# and placing the frontend assets into the backend's static folder.

$root = Get-Location
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "dashboard"
$clientDir = Join-Path $backend "client"

Write-Host "--- Starting Full Build Process ---" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "[1/4] Building Frontend (Dashboard)..." -ForegroundColor Yellow
Set-Location $frontend
cmd.exe /c npm run build

# 2. Cleanup & Prepare Backend Client Folder
Write-Host "[2/4] Preparing Backend Client folder..." -ForegroundColor Yellow
if (Test-Path $clientDir) {
    Remove-Item -Path $clientDir -Recurse -Force
}
New-Item -ItemType Directory -Path $clientDir

# 3. Copy Frontend to Backend
Write-Host "[3/4] Copying Frontend build to Backend..." -ForegroundColor Yellow
Copy-Item -Path (Join-Path $frontend "dist\*") -Destination $clientDir -Recurse

# 4. Build Backend
Write-Host "[4/4] Building Backend..." -ForegroundColor Yellow
Set-Location $backend
cmd.exe /c npm run build

Write-Host "--- Build Finished Successfully ---" -ForegroundColor Green
Write-Host "You can now deploy the contents of the 'backend' folder to Azure." -ForegroundColor Gray
Set-Location $root
