# 📱 Guia: PSQ no Android

## 🎯 Opção 1: APK Nativo (MELHOR)
✅ **Já configurado e pronto!**

### Passos:
1. Abra **Android Studio**
2. Open Project → `C:\Users\ResTIC16\Ufal\projeto\aulas\android`
3. Aguarde sincronização do Gradle
4. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
5. APK gerado em: `android\app\build\outputs\apk\debug\app-debug.apk`

### Vantagens:
- ✅ Funciona offline
- ✅ Performance nativa
- ✅ Acesso completo aos recursos do celular
- ✅ Ícone na tela inicial

---

## 🌐 Opção 2: Git + Vercel (Mais Rápido)
Para testar rapidamente online:

### Passos:
1. `git add .`
2. `git commit -m "PSQ completo"`
3. `git push origin main`
4. Conectar no **Vercel** ou **Netlify**
5. Deploy automático
6. Acessar URL no celular

### Vantagens:
- ⚡ Deploy em 2 minutos
- 🔄 Atualizações automáticas
- 📱 PWA (pode instalar como app)

---

## 📡 Opção 3: Túnel Local (Teste Imediato)
Para testar agora mesmo:

### Usando ngrok:
```bash
npm install -g ngrok
npm run dev
# Em outro terminal:
ngrok http 5173
```

### Vantagens:
- 🚀 Teste instantâneo
- 🔧 Debug em tempo real
- 📱 Acesso via QR Code

---

## 💡 Recomendação:
1. **Para desenvolvimento**: Opção 3 (ngrok)
2. **Para produção**: Opção 1 (APK nativo) 
3. **Para compartilhar**: Opção 2 (Git + Deploy)
