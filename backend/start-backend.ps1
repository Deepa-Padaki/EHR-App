# HealthSphere Backend Startup Script - Alternative Method
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthSphere Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$MAVEN_VERSION = "3.9.6"
$BACKEND_DIR = $PSScriptRoot
$MAVEN_DIR = Join-Path $BACKEND_DIR ".mvn-temp"
$MAVEN_HOME = Join-Path $MAVEN_DIR "apache-maven-$MAVEN_VERSION"

# Try multiple download sources
$DOWNLOAD_URLS = @(
    "https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.zip",
    "https://downloads.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.zip"
)

# Clean up any previous failed attempts
if (Test-Path $MAVEN_DIR) {
    Write-Host "Cleaning up previous failed download..." -ForegroundColor Yellow
    Remove-Item $MAVEN_DIR -Recurse -Force
}

Write-Host "Downloading Maven $MAVEN_VERSION..." -ForegroundColor Yellow
Write-Host "This may take 3-5 minutes depending on your internet speed" -ForegroundColor Yellow
Write-Host ""

# Create directory
New-Item -ItemType Directory -Path $MAVEN_DIR -Force | Out-Null

$downloadSuccess = $false
$zipFile = Join-Path $MAVEN_DIR "maven.zip"

foreach ($url in $DOWNLOAD_URLS) {
    try {
        Write-Host "Trying: $url" -ForegroundColor Gray
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $url -OutFile $zipFile -UseBasicParsing -TimeoutSec 300
        $ProgressPreference = 'Continue'
        $downloadSuccess = $true
        Write-Host "Download successful!" -ForegroundColor Green
        break
    } catch {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
        if (Test-Path $zipFile) {
            Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
        }
    }
}

if (-not $downloadSuccess) {
    Write-Host "All download attempts failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Maven manually:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "2. Extract to: $MAVEN_DIR" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    exit 1
}

Write-Host "Extracting Maven..." -ForegroundColor Yellow

# Extract
Expand-Archive -Path $zipFile -DestinationPath $MAVEN_DIR -Force

# Clean up zip
Remove-Item $zipFile -Force

Write-Host "Maven ready!" -ForegroundColor Green
Write-Host ""

# Set environment
$env:MAVEN_HOME = $MAVEN_HOME
$env:PATH = "$MAVEN_HOME\bin;$env:PATH"

Write-Host "Starting Spring Boot Backend..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the backend" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run Maven
Set-Location $BACKEND_DIR
& "$MAVEN_HOME\bin\mvn.cmd" clean spring-boot:run
