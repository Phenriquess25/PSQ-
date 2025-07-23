@echo off
echo 🚀 PSQ - Preparador para Android Studio
echo =====================================
echo.

echo 📦 1. Instalando dependências...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo.
echo 🏗️ 2. Buildando projeto para produção...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

echo.
echo 🔄 3. Sincronizando com Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Erro na sincronização
    pause
    exit /b 1
)

echo.
echo ✅ Projeto preparado com sucesso!
echo.
echo 📱 Próximos passos:
echo 1. Execute: npx cap open android
echo 2. OU abra manualmente a pasta 'android' no Android Studio
echo 3. Aguarde o Gradle sync
echo 4. Clique em Run (▶️) para testar
echo 5. Build → Generate Signed Bundle/APK para gerar APK
echo.
echo 🎯 APK será gerado em: android/app/build/outputs/apk/
echo.

set /p choice="Deseja abrir o Android Studio agora? (s/n): "
if /i "%choice%"=="s" (
    echo Abrindo Android Studio...
    call npx cap open android
)

pause
