@echo off
echo 🔧 Configurador Android SDK para PSQ APK
echo =======================================
echo.

echo 📥 Baixando Android SDK...
mkdir "%USERPROFILE%\android-sdk" 2>nul
cd "%USERPROFILE%\android-sdk"

echo Baixando Command Line Tools...
curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip

echo Extraindo...
powershell -command "Expand-Archive -Path cmdline-tools.zip -DestinationPath . -Force"

echo Configurando estrutura...
mkdir cmdline-tools\latest 2>nul
move cmdline-tools\cmdline-tools\* cmdline-tools\latest\ 2>nul

echo Configurando variáveis de ambiente...
setx ANDROID_HOME "%USERPROFILE%\android-sdk"
setx PATH "%PATH%;%USERPROFILE%\android-sdk\cmdline-tools\latest\bin;%USERPROFILE%\android-sdk\platform-tools"

echo.
echo ✅ Android SDK configurado!
echo 📍 Local: %USERPROFILE%\android-sdk
echo.
echo 🔄 Instalando plataformas necessárias...
"%USERPROFILE%\android-sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo.
echo ✅ Configuração completa!
echo Reinicie o terminal e execute gerar-apk-v2.bat
pause
