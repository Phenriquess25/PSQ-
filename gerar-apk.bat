@echo off
echo 📱 PSQ APK Builder - Configurador Automatico
echo =============================================
echo.

echo ⚡ Verificando Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Java encontrado! Gerando APK...
    echo.
    echo 🔄 Fazendo build do projeto...
    call npm run build
    echo.
    echo 🔄 Sincronizando com Capacitor...
    call npx cap sync
    echo.
    echo 🔄 Gerando APK Android...
    cd android
    call gradlew assembleDebug
    echo.
    echo 🎉 APK gerado em: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 📱 Para instalar no celular:
    echo 1. Copie o arquivo app-debug.apk para o celular
    echo 2. No celular, habilite "Fontes desconhecidas" nas configurações
    echo 3. Toque no arquivo APK para instalar
    echo.
    pause
) else (
    echo ❌ Java não encontrado!
    echo.
    echo � INSTALANDO JAVA AUTOMATICAMENTE...
    echo Tentando instalar via winget...
    winget install EclipseAdoptium.Temurin.17.JDK
    if %errorlevel% equ 0 (
        echo ✅ Java instalado! Reinicie o terminal e execute o script novamente.
    ) else (
        echo.
        echo 📥 Instalação manual necessária:
        echo 1. Download direto: https://adoptium.net/temurin/releases/
        echo 2. Via chocolatey: choco install temurin17
        echo.
        echo 🌟 ALTERNATIVA RÁPIDA: Use PWA!
        echo Acesse http://192.168.0.104:5173/ no Chrome do celular
        echo e adicione à tela inicial!
    )
    echo.
    pause
)
