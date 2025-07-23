@echo off
echo 📱 PSQ - Gerador de APK Avançado
echo =================================
echo.

echo Verificando se o projeto está preparado...
if not exist "android\" (
    echo ❌ Pasta android não encontrada!
    echo Execute primeiro: preparar-android.bat
    pause
    exit /b 1
)

cd android

echo.
echo 🎯 Escolha o tipo de APK:
echo 1. Debug APK (rápido, para testes)
echo 2. Release APK (otimizado, para distribuição)
echo.
set /p choice="Digite sua escolha (1 ou 2): "

if "%choice%"=="1" (
    echo.
    echo 🔨 Gerando APK Debug...
    call gradlew assembleDebug
    if %errorlevel% equ 0 (
        echo.
        echo ✅ APK Debug gerado com sucesso!
        echo 📍 Local: android\app\build\outputs\apk\debug\app-debug.apk
    ) else (
        echo ❌ Erro ao gerar APK Debug
    )
) else if "%choice%"=="2" (
    echo.
    echo 🔨 Gerando APK Release...
    call gradlew assembleRelease
    if %errorlevel% equ 0 (
        echo.
        echo ✅ APK Release gerado com sucesso!
        echo 📍 Local: android\app\build\outputs\apk\release\app-release.apk
        echo.
        echo ⚠️ Nota: APK release precisa ser assinado para instalação
        echo Use Android Studio: Build → Generate Signed Bundle/APK
    ) else (
        echo ❌ Erro ao gerar APK Release
    )
) else (
    echo ❌ Opção inválida
    goto :eof
)

cd ..

echo.
set /p open="Deseja abrir a pasta do APK? (s/n): "
if /i "%open%"=="s" (
    start explorer "android\app\build\outputs\apk"
)

echo.
echo 🎉 Processo concluído!
pause
