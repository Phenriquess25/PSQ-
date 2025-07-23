@echo off
echo 📱 PSQ APK Builder - Configurador Automatico V2.0
echo ================================================
echo.

echo ⚡ Verificando Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java não encontrado! 
    echo Execute: winget install EclipseAdoptium.Temurin.17.JDK
    goto :pause_exit
)

echo ✅ Java encontrado!
echo.

echo 🔧 Verificando Android SDK...
if exist "%LOCALAPPDATA%\Android\Sdk" (
    set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
    echo ✅ Android SDK encontrado!
) else (
    echo ❌ Android SDK não encontrado!
    echo.
    echo 📥 CONFIGURE O ANDROID SDK:
    echo 1. Abra Android Studio
    echo 2. File ^> Settings ^> Android SDK
    echo 3. Instale Android 14.0 (API 34)
    echo.
    echo 🌟 ALTERNATIVA MAIS FÁCIL:
    echo PWA Builder: https://www.pwabuilder.com/
    echo URL: http://192.168.0.104:5173/
    goto :pause_exit
)

echo.
echo 🔄 Gerando APK...

echo 🔄 1. Build do projeto...
call npm run build

echo 🔄 2. Sincronizando...
call npx cap sync

echo 🔄 3. Gerando APK...
cd android
call gradlew assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo 🎉 APK GERADO! 
    echo 📱 Local: android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ❌ Erro! Use PWA Builder como alternativa.
)

:pause_exit
echo.
pause
