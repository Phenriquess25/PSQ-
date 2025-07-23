# 📱 Como Transformar PSQ em APK

Existem várias maneiras de ter o PSQ no seu celular como um app nativo. Aqui estão as opções:

## 🌟 OPÇÃO 1: PWA (Progressive Web App) - MAIS FÁCIL ✅

**Vantagens:** Funciona offline, ícone na tela inicial, experiência nativa
**Como fazer:**

1. Abra `http://192.168.0.104:5173/` no Chrome do celular
2. Toque no menu (3 pontinhos) 
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a instalação
5. O PSQ aparecerá como um app normal no seu celular!

## 🛠️ OPÇÃO 2: APK com Android Studio

**Pré-requisitos:**
- Android Studio instalado
- Java JDK 11+ configurado
- Android SDK configurado

**Passos:**
1. `npm run build` (já feito ✅)
2. `npx cap sync` (já feito ✅)
3. `npx cap open android`
4. No Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s)

## 🔧 OPÇÃO 3: APK via Command Line

**Se você tem Java configurado:**

```bash
cd android
./gradlew assembleDebug
```

O APK será gerado em: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📦 OPÇÃO 4: Online APK Builder

Use serviços como:
- **PWA to APK:** pwabuilder.com
- **Capacitor Cloud:** ionic.io

## 🎯 RECOMENDAÇÃO

Para uso imediato, use a **OPÇÃO 1 (PWA)**. É mais rápida e dá uma experiência quase idêntica a um app nativo!

---

## ⚡ Status Atual do Projeto

✅ Projeto React configurado
✅ Capacitor configurado
✅ Build de produção gerado
✅ PWA configurado
✅ Pronto para instalação como PWA
⚠️ APK requer Java/Android Studio

## 📱 Para Instalar como PWA AGORA:

1. Acesse: `http://192.168.0.104:5173/`
2. Chrome > Menu > "Adicionar à tela inicial"
3. Pronto! PSQ no seu celular! 🎉
