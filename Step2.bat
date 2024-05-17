REM Clone a Git repository

:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process '%~f0' -Verb runAs"
    exit /b
)

echo.
echo Cloning a Git repository of Code...

REM Define the repository URL
set "REPO_URL=https://github.com/Apnacoderofficial/3DPrinting-Application.git"

REM Define the directory where the repository will be cloned
set "CLONE_DIR=C:\Program Files\3D sPrinting Application"

REM Create the directory if it doesn't exist
if not exist "%CLONE_DIR%" mkdir "%CLONE_DIR%"

REM Change to the directory where the repository will be cloned
cd /D "%CLONE_DIR%"

REM Clone the repository
git clone "%REPO_URL%"

echo.
echo Repository cloned successfully.

REM Run the npm start to start the port 
echo.
echo Running the npm start...

REM Define the directory where the repository will be cloned
set "CLONE_DIR=C:\Program Files\3D sPrinting Application\3DPrinting-Application"
cd /D "%CLONE_DIR%"
npm install 
npm start

echo.
echo Installation completed.
