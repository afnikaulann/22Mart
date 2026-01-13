@echo off
echo ================================
echo 22Mart E-Commerce Setup Script
echo ================================
echo.

echo [1/6] Installing root dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo.

echo [2/6] Installing backend dependencies...
cd backend
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo.

echo [3/6] Generating Prisma Client...
call pnpm prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    cd ..
    pause
    exit /b 1
)
echo.

echo [4/6] Running database migrations...
call pnpm prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo WARNING: Database migration failed. Make sure your database is accessible.
    echo You can run this later with: cd backend && pnpm prisma migrate dev
)
echo.

echo [5/6] Building backend to verify...
call pnpm run build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo [6/6] Installing frontend dependencies...
cd frontend
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ================================
echo Setup completed successfully!
echo ================================
echo.
echo To start the development servers:
echo   - Both servers: pnpm run dev
echo   - Backend only: pnpm run dev:api
echo   - Frontend only: pnpm run dev:web
echo.
echo Backend will run on: http://localhost:4000
echo Frontend will run on: http://localhost:3000
echo API Docs: http://localhost:4000/api/docs
echo.
pause
