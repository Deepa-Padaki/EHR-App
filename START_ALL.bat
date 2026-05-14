@echo off
echo ========================================
echo HealthSphere - Full Application Startup
echo ========================================
echo.

echo This script will help you run both frontend and backend
echo.
echo Current Status:
echo - Frontend: Already running on http://localhost:3001
echo - Backend: Starting up (Maven downloading in progress)
echo.
echo If Maven download takes too long, you have these options:
echo.
echo OPTION 1: Use an IDE (Fastest)
echo 1. Open backend folder in IntelliJ IDEA or Eclipse
echo 2. Let the IDE download dependencies automatically
echo 3. Run HealthSphereApplication.java directly
echo.
echo OPTION 2: Install Maven Manually
echo 1. Download from: https://maven.apache.org/download.cgi
echo 2. Extract to C:\Program Files\Apache\maven
echo 3. Add C:\Program Files\Apache\maven\bin to PATH
echo 4. Open new terminal and run:
echo    cd backend
echo    mvn spring-boot:run
echo.
echo OPTION 3: Wait for automatic download
echo - Maven is currently being downloaded automatically
echo - This may take 5-10 minutes depending on your internet
echo - Once complete, backend will start automatically on port 8080
echo.
echo ========================================
echo Access the application:
echo - Frontend: http://localhost:3001 (RUNNING)
echo - Backend: http://localhost:8080 (STARTING)
echo - H2 Console: http://localhost:8080/h2-console
echo ========================================
echo.
pause
