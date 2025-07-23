import { useState, useEffect } from 'react'
import { initDatabase, db } from './db/simpleStorage'
import Dashboard from './components/Dashboard'
import CourseManager from './components/CourseManager'
import SimpleKanban from './components/SimpleKanban'
import SubjectDetails from './components/SubjectDetails'
import Schedule from './components/Schedule'
import Achievements from './components/Achievements'
import { BookOpen, Calendar, BarChart3, Trophy } from 'lucide-react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Inicializando banco de dados...')
        // DESCOMENTE A LINHA ABAIXO PARA LIMPAR TODOS OS DADOS:
        // clearAllData()
        await initDatabase()
        
        // Criar uma disciplina de teste se não existir nenhuma
        const subjects = await db.subjects.findMany()
        console.log('Disciplinas existentes:', subjects)
        
        if (subjects.length === 0) {
          console.log('Criando disciplina de teste...')
          const newSubject = await db.subjects.create({
            name: 'Matemática Teste',
            description: 'Disciplina criada automaticamente para teste',
            professor: 'Prof. Teste',
            schedule: [{ day: 'Segunda', startTime: '08:00', endTime: '10:00' }]
          })
          console.log('Disciplina de teste criada:', newSubject)
        }
        
        console.log('Banco inicializado com sucesso!')
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao inicializar app:', error)
        setIsLoading(false)
      }
    }
    
    initApp()
  }, [])

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
          Carregando PSQ - Pedro Study Quest...
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'subjects', label: 'Disciplinas', icon: BookOpen },
    { id: 'schedule', label: 'Agenda', icon: Calendar },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
  ]

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onSelectSubject={(subject) => {
              console.log('Dashboard - Subject selecionado:', subject)
              setSelectedSubjectId(subject.id)
              setCurrentView('details')
            }} 
          />
        )
      case 'subjects':
        return (
          <CourseManager 
            onSubjectClick={(subjectId) => {
              setSelectedSubjectId(subjectId)
              setCurrentView('details')
            }}
          />
        )
      case 'schedule':
        return (
          <Schedule 
            onSubjectClick={(subjectId) => {
              setSelectedSubjectId(subjectId)
              setCurrentView('details')
            }}
          />
        )
      case 'achievements':
        return <Achievements />
      case 'details':
        console.log('App - Renderizando SubjectDetails com ID:', selectedSubjectId)
        if (!selectedSubjectId) {
          console.error('App - selectedSubjectId é null, redirecionando para dashboard')
          setCurrentView('dashboard')
          return <Dashboard onSelectSubject={(subject) => {
            setSelectedSubjectId(subject.id)
            setCurrentView('details')
          }} />
        }
        return (
          <SubjectDetails 
            subjectId={selectedSubjectId}
            onBack={() => {
              console.log('App - Voltando do SubjectDetails para dashboard')
              setCurrentView('dashboard')
            }}
            onKanban={() => {
              console.log('App - Navegando para kanban com selectedSubjectId:', selectedSubjectId)
              console.log('App - currentView antes:', currentView)
              if (selectedSubjectId) {
                setCurrentView('kanban')
                console.log('App - setCurrentView("kanban") executado')
              } else {
                console.error('App - selectedSubjectId é null, não pode abrir kanban')
                alert('Erro: Nenhuma disciplina selecionada para o kanban')
              }
            }}
          />
        )
      case 'kanban':
        console.log('App - Renderizando SubjectKanban com ID:', selectedSubjectId)
        if (!selectedSubjectId) {
          console.error('App - selectedSubjectId é null no kanban, redirecionando para dashboard')
          setCurrentView('dashboard')
          return <Dashboard onSelectSubject={(subject) => {
            setSelectedSubjectId(subject.id)
            setCurrentView('details')
          }} />
        }
        return (
          <SimpleKanban 
            subjectId={selectedSubjectId}
            onBack={() => {
              console.log('App - Voltando do kanban para details')
              setCurrentView('details')
            }} 
          />
        )
      default:
        return (
          <Dashboard 
            onSelectSubject={(subject) => {
              setSelectedSubjectId(subject.id)
              setCurrentView('details')
            }} 
          />
        )
    }
  }

  // Se um subject foi selecionado, não fazer navegação automática
  // A navegação agora é controlada pelos botões

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>📚 PSQ</h1>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            margin: 0, 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Pedro Study Quest
          </p>
        </div>
        <ul className="nav-menu">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  )
}

export default App
