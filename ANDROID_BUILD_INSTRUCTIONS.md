# 📱 PSQ - Pedro Study Quest APK

## ✅ Projeto Configurado para Android!

### 🛠️ Como gerar o APK:

#### **Opção 1: Android Studio (Recomendada)**
1. **Abra Android Studio**
2. **Abra o projeto**: `C:\Users\***\***\android`
3. **Aguarde a indexação** do projeto
4. **Vá em**: Build → Generate Signed Bundle/APK
5. **Escolha**: APK
6. **Crie uma chave** ou use existente
7. **Build Type**: Release
8. **Clique**: Finish

#### **Opção 2: Linha de Comando**
```bash
cd "C:\Users\***\***\android"
.\gradlew assembleDebug
```

O APK será gerado em: `android\app\build\outputs\apk\debug\app-debug.apk`

### 🚀 Para atualizar o app:
1. Faça suas alterações no código React
2. Execute: `npm run build`
3. Execute: `npx cap sync android`
4. Gere novo APK

### 📦 Funcionalidades no APK:
- ✅ **Funcionamento offline** (dados salvos localmente)
- ✅ **Interface nativa** Android
- ✅ **Todas as funcionalidades** do PSQ
- ✅ **Kanban mobile-friendly**
- ✅ **Sistema de pontos**
- ✅ **Gestão de disciplinas**

### ⚠️ Requisitos:
- **Android Studio** ou **Java SDK** instalado
- **Android SDK** configurado
- **Gradle** (geralmente incluído no Android Studio)

### 🎯 Próximos Passos:
1. **Instale Android Studio** se não tiver
2. **Abra o projeto** na pasta `android`
3. **Gere o APK** usando Build → Generate Signed Bundle/APK
4. **Instale no telefone** via USB ou compartilhe o arquivo APK

### 📱 Testando:
- O APK funcionará como um app nativo
- Dados serão salvos localmente no dispositivo
- Interface se adaptará ao tamanho da tela
- Funciona offline (não precisa de internet)

## 🎉 Parabéns! Seu PSQ agora pode virar um APK Android!
