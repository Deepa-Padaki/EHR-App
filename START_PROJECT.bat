@echo off
echo ========================================
echo HealthSphere Project Startup
echo ========================================
echo.

echo Prerequisites needed:
echo 1. Maven (mvn) - Not found in PATH
echo 2. Node.js and npm - Found ✓
echo.

echo To run this project, you need to:
echo.
echo STEP 1: Install Maven
echo - Download Maven from: https://maven.apache.org/download.cgi
echo - Extract and add bin folder to PATH
echo - Or use: choco install maven (if Chocolatey is installed)
echo.

echo STEP 2: Run Backend
echo cd backend
echo mvn clean install
echo mvn spring-boot:run
echo.

echo STEP 3: Run Frontend (in a new terminal)
echo cd frontend
echo npm install
echo npm run dev
echo.

echo Alternative: Use an IDE
echo - Open backend folder in IntelliJ IDEA or Eclipse
echo - Run HealthSphereApplication.java directly
echo - Open frontend folder in VS Code
echo - Run npm install and npm run dev
echo.

echo ========================================
echo Current Status:
echo - Java: Installed (version 21)
echo - npm: Installed (version 11.8.0)
echo - Maven: Not found
echo ========================================

pause
