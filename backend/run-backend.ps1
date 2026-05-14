# HealthSphere Backend Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthSphere Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$MAVEN_VERSION = "3.9.6"
$MAVEN_URL = "https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.zip"
$MAVEN_DIR = "$env:TEMP\apache-maven"
$MAVEN_HOME = "$MAVEN_DIR\apache-maven-$MAVEN_VERSION"

# Check if Maven is already downloaded
if (Test-Path "$MAVEN_HOME\bin\mvn.cmd") {
    Write-Host "Maven found, using existing installation..." -ForegroundColor Green
} else {
    Write-Host "Downloading Maven $MAVEN_VERSION..." -ForegroundColor Yellow
    
    # Create temp directory
    if (-not (Test-Path $MAVEN_DIR)) {
        New-Item -ItemType Directory -Path $MAVEN_DIR | Out-Null
    }
    
    # Download Maven
    $zipFile = "$MAVEN_DIR\maven.zip"
    Invoke-WebRequest -Uri $MAVEN_URL -OutFile $zipFile
    
    # Extract Maven
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath $MAVEN_DIR -Force
    Remove-Item $zipFile
    
    Write-Host "Maven downloaded successfully!" -ForegroundColor Green
}

# Set Maven path
$env:PATH = "$MAVEN_HOME\bin;$env:PATH"

Write-Host ""
Write-Host "Building and starting backend..." -ForegroundColor Yellow
Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot

# Run Maven
& "$MAVEN_HOME\bin\mvn.cmd" spring-boot:run

Write-Host ""
Write-Host "Backend stopped." -ForegroundColor Cyan
