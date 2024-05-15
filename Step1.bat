@echo off

REM Node.js installation
echo Installing Node.js...

REM Define the Node.js version you want to install
set "NODE_VERSION=v22.1.0"

REM Define the download URL for the Node.js installer
set "NODE_URL=https://nodejs.org/dist/%NODE_VERSION%/node-%NODE_VERSION%-x64.msi"

REM Define the installation directory for Node.js
set "NODE_INSTALL_DIR=C:\Node.js"

REM Create the installation directory if it doesn't exist
if not exist "%NODE_INSTALL_DIR%" mkdir "%NODE_INSTALL_DIR%"

REM Download Node.js installer
echo Downloading Node.js installer...
curl -o node_installer.msi "%NODE_URL%"

REM Install Node.js
echo Installing Node.js...
msiexec /i node_installer.msi /qn INSTALLDIR="%NODE_INSTALL_DIR%"

REM Check if Node.js installation was successful
if exist "%NODE_INSTALL_DIR%\node.exe" (
    echo Node.js installation completed successfully.
) else (
    echo Node.js installation failed.
)

REM Clean up
del node_installer.msi

REM Git installation
echo.
echo Installing Git...

REM Define the download URL for the Git installer
@REM set "GIT_URL=https://github.com/git-for-windows/git/releases/download/v2.45.1.windows.1/Git-2.45.1-64-bit.exe"
winget install --id Git.Git -e --source winget

REM Define the installation directory for Git
set "GIT_INSTALL_DIR=C:\Git"

REM Download Git installer
echo Downloading Git installer...
curl -o git_installer.exe "%GIT_URL%"

REM Install Git
echo Installing Git...
git_installer.exe /VERYSILENT /NORESTART /DIR="%GIT_INSTALL_DIR%"

REM Check if Git installation was successful
if exist "%GIT_INSTALL_DIR%\bin\git.exe" (
    echo Git installation completed successfully.
) else (
    echo Git installation failed.
)

REM Clean up
del git_installer.exe

REM Clone a Git repository
echo.
echo Cloning a Git repository...

REM Define the repository URL
set "REPO_URL=https://github.com/Apnacoderofficial/3DPrinting-Application.git"

REM Define the directory where the repository will be cloned
set "CLONE_DIR=C:\Projects"

REM Create the directory if it doesn't exist
if not exist "%CLONE_DIR%" mkdir "%CLONE_DIR%"

REM Change to the directory where the repository will be cloned
cd /D "%CLONE_DIR%"

REM Clone the repository
git clone -b master "%REPO_URL%"

echo.
echo Repository cloned successfully.


REM Run the .bat file
echo.
echo Running Installer File of 3D Print  Software...

start "" "C:\Projects\3DPrinting-Application\3D-Printing.exe"

echo.
echo Installation completed.