@echo off
title Astro World - NASA Space Station (ISS)
cd /d "%~dp0"
echo ========================================================
echo   Launching Astro World: NASA ISS Mission...
echo ========================================================

REM Priority 1: Launch native PowerShell HTTP server if available
if exist "%~dp0server.ps1" (
    echo Starting native PowerShell HTTP server on port 8080...
    start "" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
    exit /b 0
)

REM Priority 2: Python HTTP server
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting Python HTTP server on port 8080...
    start "" python -m http.server 8080
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:8080/"
    exit /b 0
)

REM Priority 3: npx serve
where npx >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting npx serve on port 8080...
    start "" npx serve -l 8080 "%~dp0"
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:8080/"
    exit /b 0
)

REM Fallback: direct browser launch
echo Opening index.html directly...
start "" "%~dp0index.html"
exit /b 0
