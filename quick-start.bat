@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo Markdown Publish Tool - Quick Start
echo ========================================

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Please install Node.js 18+ first:
  echo https://nodejs.org/
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is not available. Please reinstall Node.js.
  pause
  exit /b 1
)

echo [1/3] Installing dependencies...
call npm.cmd install --no-fund --no-audit
if errorlevel 1 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

set "LAN_IP=127.0.0.1"
for /f "usebackq delims=" %%i in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$ip=(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue ^| Where-Object {$_.IPAddress -ne '127.0.0.1' -and $_.PrefixOrigin -ne 'WellKnown'} ^| Select-Object -First 1 -ExpandProperty IPAddress); if([string]::IsNullOrWhiteSpace($ip)){'127.0.0.1'} else {$ip}"`) do set "LAN_IP=%%i"

echo [2/3] Starting dev server...
echo.
echo Access URLs:
echo - Local: http://localhost:5173
echo - LAN  : http://%LAN_IP%:5173
echo.
echo Press Ctrl+C to stop.
echo.

call npm.cmd run dev:host

echo.
echo Dev server stopped.
pause
endlocal
