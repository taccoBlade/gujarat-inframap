@echo off
echo ============================================================
echo GUJARAT INFRAMAP - FIREBASE AUTHENTICATION ^& RULE DEPLOYMENT
echo Target Project: gujarat-infra
echo ============================================================
echo.
echo Step 1: Authorizing Firebase CLI with your Google Account...
call npx -y firebase-tools login
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Login was cancelled or failed.
    pause
    exit /b %errorlevel%
)
echo.
echo Step 2: Deploying production Firestore Rules to gujarat-infra...
call npx -y firebase-tools deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed. Check your Firebase permissions.
    pause
    exit /b %errorlevel%
)
echo.
echo ============================================================
echo SUCCESS: Firestore Security Rules are now live in the cloud!
echo ============================================================
pause
