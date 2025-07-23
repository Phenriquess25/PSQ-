# 📱 Guia: Rodando PSQ no Android Studio e Gerando APK

## 🚀 Passo a Passo Completo

### 1. **Preparar o Projeto Web**
```bash
# No diretório do projeto clonado
npm install
npm run build
```

### 2. **Sincronizar com Android**
```bash
# Sincronizar arquivos para Android
npx cap sync android
```

### 3. **Abrir no Android Studio**
```bash
# Abrir projeto Android
npx cap open android
```
**OU** abra manualmente:
- Android Studio → Open → Navegue até `pasta-do-projeto/android`

### 4. **Configurar Android Studio**

#### 4.1 **Verificar SDK**
- File → Settings → Android SDK
- Verificar se está instalado:
  - ✅ Android 14 (API 34)
  - ✅ Android SDK Build-Tools 34.0.0
  - ✅ Android SDK Platform-Tools

#### 4.2 **Sync Gradle**
- Aguardar o Android Studio baixar dependências
- Se aparecer "Gradle Sync", clique em **Sync Now**

### 5. **Testar no Emulador/Dispositivo**

#### 5.1 **Emulador Android**
- Tools → AVD Manager
- Create Virtual Device
- Escolher um dispositivo (ex: Pixel 7)
- Download system image Android 14
- Finish

#### 5.2 **Dispositivo Físico**
- Ativar **Opções do Desenvolvedor** no Android
- Ativar **Depuração USB**
- Conectar USB e autorizar

#### 5.3 **Executar**
- Selecionar dispositivo na barra superior
- Clicar no botão **▶️ Run** (ou Shift+F10)

### 6. **Gerar APK de Produção**

#### 6.1 **Via Android Studio (Recomendado)**
1. Build → Generate Signed Bundle/APK
2. Escolher **APK**
3. **Create new keystore:**
   - Key store path: `C:\Users\SEU_USUARIO\psq-key.jks`
   - Password: `psq123456` (ou escolha uma senha)
   - Key alias: `psq`
   - Validity: 25 years
   - First/Last Name: Pedro
   - Organization: PSQ
4. Next → **release** → Finish
5. APK será gerado em: `android/app/release/app-release.apk`

#### 6.2 **Via Terminal (Alternativo)**
```bash
# No diretório do projeto
cd android

# Gerar APK debug (mais rápido)
./gradlew assembleDebug

# Gerar APK release (otimizado)
./gradlew assembleRelease
```

### 7. **Localizar APK Gerado**
```
Pasta do projeto/
├── android/
    └── app/
        └── build/
            └── outputs/
                └── apk/
                    ├── debug/
                    │   └── app-debug.apk
                    └── release/
                        └── app-release.apk
```

### 8. **Instalar APK**
- **Emulador**: Arraste o APK para a tela
- **Dispositivo**: Transfira via cabo USB e instale
- **Via ADB**: `adb install app-release.apk`

## 🔧 Troubleshooting

### ❌ **Erro: "SDK not found"**
```bash
# Definir ANDROID_HOME
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
```

### ❌ **Erro: "Java not found"**
- Instalar JDK 17: `winget install EclipseAdoptium.Temurin.17.JDK`

### ❌ **Erro: "Gradle sync failed"**
- File → Invalidate Caches and Restart
- Clean Project → Rebuild Project

### ❌ **APK não instala**
- Ativar "Fontes desconhecidas" no Android
- Verificar se é APK release (não debug)

## 📲 Resultado Final

Após seguir estes passos você terá:
- ✅ PSQ rodando no emulador/dispositivo
- ✅ APK gerado para distribuição
- ✅ App instalável em qualquer Android

## 🎯 Próximos Passos

1. **Testar** todas as funcionalidades no dispositivo
2. **Otimizar** performance se necessário
3. **Distribuir** APK para usuários
4. **Publicar** na Google Play Store (opcional)

---
**🚀 PSQ - Pedro Study Quest está pronto para Android!**
