<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# PSQ - Pedro Study Quest - App de Estudos Gamificado

Este é um projeto React + Vite para um aplicativo web de organização de estudos universitários com elementos de gamificação.

## Tecnologias Utilizadas

- **Frontend**: React 18, Vite
- **Banco de Dados**: SQLite com Better-SQLite3
- **ORM**: Drizzle ORM
- **UI**: Lucide React (ícones), CSS custom
- **Drag & Drop**: @dnd-kit para Kanban
- **Utilitários**: date-fns, clsx

## Estrutura do Projeto

### Banco de Dados (src/db/)
- `schema.js`: Definições das tabelas (courses, subjects, tasks, user, achievements)
- `database.js`: Configuração do banco SQLite e funções de inicialização

### Componentes (src/components/)
- `Dashboard.jsx`: Tela principal com estatísticas e acesso rápido
- `CourseManager.jsx`: Gerenciamento de cursos e disciplinas
- `SubjectKanban.jsx`: Board Kanban para tasks de uma disciplina específica
- `Schedule.jsx`: Agenda semanal de aulas

## Funcionalidades Principais

1. **Gestão Acadêmica**: Cadastro de cursos e disciplinas
2. **Sistema Kanban**: Organização de tarefas em 3 colunas (A Fazer, Fazendo, Concluído)
3. **Gamificação**: Sistema de pontos, níveis, XP e conquistas
4. **Agenda**: Visualização de horários de aulas
5. **IA Integration**: Estimativa de tempo e dificuldade para tarefas (futuro)

## Padrões de Código

- Use functional components com hooks
- Mantenha os estilos CSS organizados e responsivos
- Implemente error handling nas operações de banco
- Use async/await para operações assíncronas
- Siga convenções de nomenclatura em português para UI/UX
- Mantenha componentes pequenos e reutilizáveis

## Banco de Dados

O banco SQLite é criado automaticamente no arquivo `studyapp.db` na raiz do projeto. As tabelas são inicializadas automaticamente na primeira execução.

### Relacionamentos
- Courses → Subjects (1:N)
- Subjects → Tasks (1:N)
- User → Achievements (1:N)

## Próximas Funcionalidades

- Integração com API de IA para sugerir tempo e dificuldade
- Sistema de notificações e lembretes
- Exportação/importação de dados
- Modo escuro
- PWA (Progressive Web App)
- Sincronização em nuvem
