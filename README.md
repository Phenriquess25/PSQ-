# 📚 PSQ - Pedro Study Quest - App de Estudos Gamificado

Um aplicativo web moderno para organizar seus estudos universitários com elementos de gamificação, sistema Kanban e agenda integrada.

## ✨ Funcionalidades

### 🎯 **Gestão Acadêmica**
- ✅ Cadastro de cursos e disciplinas
- ✅ Organização por horários e dias
- ✅ Agenda semanal visual

### 📋 **Sistema Kanban**
- ✅ Board individual para cada disciplina
- ✅ 3 colunas: "A Fazer" → "Fazendo" → "Concluído"
- ✅ Drag & Drop para mover tarefas
- ✅ Sistema de dificuldade (1-5)
- ✅ Estimativa de tempo

### 🎮 **Gamificação**
- ✅ Sistema de pontos por tarefa
- ✅ Níveis e XP
- ✅ Streak de dias consecutivos
- ✅ Dashboard com estatísticas
- 🔄 Conquistas e badges (em desenvolvimento)

### 🤖 **IA Integration (Futuro)**
- 🔄 Estimativa automática de dificuldade
- 🔄 Sugestão de tempo baseada no assunto
- 🔄 Geração de ementa

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação Web
```bash
# Clonar repositório
git clone https://github.com/Phenriquess25/PSQ-.git
cd PSQ-

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### 📱 Android Studio & APK

#### Preparação Rápida (Recomendado)
```bash
# Execute o script automatizado
preparar-android.bat
```

#### Preparação Manual
```bash
# 1. Build do projeto
npm run build

# 2. Sincronizar com Android
npx cap sync android

# 3. Abrir no Android Studio
npx cap open android
```

#### Gerar APK
1. **Via Script**: Execute `gerar-apk-completo.bat`
2. **Via Android Studio**: 
   - Build → Generate Signed Bundle/APK
   - Escolha APK → Create keystore → Release
3. **Via Terminal**: `cd android && gradlew assembleDebug`

📍 **APK gerado em**: `android/app/build/outputs/apk/`

**📋 Guia completo**: [GUIA-ANDROID-STUDIO.md](GUIA-ANDROID-STUDIO.md)

### Build para Produção
```bash
npm run build
npm run preview
```

## 🛠️ Tecnologias

- **Frontend**: React 18, Vite
- **Banco**: SQLite + Better-SQLite3
- **ORM**: Drizzle ORM
- **UI**: Lucide React, CSS Custom
- **DnD**: @dnd-kit
- **Utils**: date-fns, clsx

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Dashboard.jsx    # Tela principal
│   ├── CourseManager.jsx # Gestão de cursos/disciplinas
│   ├── SubjectKanban.jsx # Board Kanban
│   └── Schedule.jsx     # Agenda de aulas
├── db/                  # Configuração do banco
│   ├── schema.js       # Definição das tabelas
│   └── database.js     # Configuração SQLite
├── App.jsx             # Componente principal
└── App.css            # Estilos globais
```

## 💾 Banco de Dados

O banco SQLite é criado automaticamente como `studyapp.db`. Estrutura:

- **courses**: Cursos cadastrados
- **subjects**: Disciplinas por curso
- **tasks**: Tarefas no sistema Kanban
- **user**: Dados do usuário (gamificação)
- **achievements**: Conquistas desbloqueadas

## 🎨 Interface

### Dashboard
- Estatísticas gerais
- Progresso de nível e XP
- Acesso rápido às disciplinas

### Kanban
- Visualização por disciplina
- Drag & Drop intuitivo
- Código de cores por dificuldade
- Estimativa de tempo

### Agenda
- Grade semanal de horários
- Indicador de aula atual
- Próximas aulas em destaque

## 🔮 Roadmap

### Próximas Versões
- [ ] Integração com IA (OpenAI/Gemini)
- [ ] Sistema de notificações
- [ ] Modo escuro
- [ ] PWA (instalável)
- [ ] Sincronização em nuvem
- [ ] Relatórios de produtividade
- [ ] Timer Pomodoro integrado

### Melhorias UX
- [ ] Animações e transições
- [ ] Responsividade mobile
- [ ] Atalhos de teclado
- [ ] Temas personalizáveis

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Feito com ❤️ para estudantes universitários que querem organizar melhor seus estudos!**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

Pedro Study Quest - um app pensado para auxiliar o estudante com seus horarios e agenda com elementos de gamificação.

## 🔧 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Mobile**: Capacitor (para APK Android)
- **Banco de Dados**: SQLite (localStorage)
- **UI/UX**: CSS customizado + Lucide React (ícones)
- **Build**: Vite para desenvolvimento e produção

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute em desenvolvimento: `npm run dev`
4. Para APK Android: `npm run build` → `npx cap sync android`
