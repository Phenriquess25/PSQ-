import { useState, useEffect } from 'react'
import { db } from '../db/simpleStorage'
import { BarChart3, BookOpen, Clock, Trophy, TrendingUp, AlertTriangle, Calendar, CheckCircle } from 'lucide-react'

function Dashboard({ onSelectSubject }) {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalPoints: 0,
    currentStreak: 0
  })
  const [recentSubjects, setRecentSubjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [upcomingExams, setUpcomingExams] = useState([])

  useEffect(() => {
    loadDashboardData()
    
    // Listener para atualizar dashboard quando dados mudam
    const handleStorageChange = (e) => {
      if (e.key === 'psq_tasks' || e.key === 'psq_subjects') {
        loadDashboardData()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Também monitora mudanças internas (mesmo tab)
    const checkForUpdates = setInterval(() => {
      loadDashboardData()
    }, 5000) // Atualiza a cada 5 segundos
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(checkForUpdates)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('Dashboard - Carregando dados...')
      // Carregar estatísticas
      const subjectList = await db.subjects.findMany()
      console.log('Dashboard - Disciplinas carregadas:', subjectList)
      const taskList = await db.tasks.findMany()
      console.log('Dashboard - Tasks carregadas:', taskList)
      const completedTasks = taskList.filter(task => task.status === 'done')
      console.log('Dashboard - Tasks completas:', completedTasks)
      const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 10), 0)
      console.log('Dashboard - Total de pontos calculado:', totalPoints)

      const newStats = {
        totalSubjects: subjectList.length,
        totalTasks: taskList.length,
        completedTasks: completedTasks.length,
        totalPoints,
        currentStreak: Math.floor(totalPoints / 50) // Streak baseado em pontos
      }
      
      console.log('Dashboard - Novas estatísticas:', newStats)
      setStats(newStats)

      // Carregar disciplinas recentes
      setRecentSubjects(subjectList.slice(0, 6))
      console.log('Dashboard - Disciplinas recentes definidas:', subjectList.slice(0, 6))

      // Carregar provas próximas e notificações
      await loadNotifications(subjectList, taskList)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    }
  }

  const loadNotifications = async (subjectList, taskList) => {
    try {
      const notifications = []
      const examsList = []
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Processar provas próximas
      subjectList.forEach(subject => {
        if (subject.provas && Array.isArray(subject.provas)) {
          subject.provas.forEach(prova => {
            const examDate = new Date(prova.data)
            if (examDate >= today && examDate <= nextWeek) {
              examsList.push({
                ...prova,
                subjectName: subject.name,
                subjectId: subject.id,
                daysLeft: Math.ceil((examDate - today) / (1000 * 60 * 60 * 24))
              })
            }
          })
        }
      })

      // Criar notificações baseadas nas provas
      examsList.forEach(exam => {
        notifications.push({
          id: `exam-${exam.id}`,
          type: 'exam',
          title: `Prova de ${exam.subjectName}`,
          message: `${exam.titulo} em ${exam.daysLeft} dias`,
          date: exam.data,
          priority: exam.daysLeft <= 2 ? 'high' : 'medium',
          icon: '🚨'
        })
      })

      // Notificações de tasks pendentes
      const pendingTasks = taskList.filter(task => task.status !== 'done')
      if (pendingTasks.length > 10) {
        notifications.push({
          id: 'tasks-pending',
          type: 'warning',
          title: 'Muitas tasks pendentes',
          message: `Você tem ${pendingTasks.length} tasks para completar`,
          priority: 'medium',
          icon: '📝'
        })
      }

      // Notificação de conquista
      if (stats.totalPoints > 0 && stats.totalPoints % 100 === 0) {
        notifications.push({
          id: 'achievement',
          type: 'success',
          title: 'Conquista desbloqueada!',
          message: `Parabéns! Você atingiu ${stats.totalPoints} pontos`,
          priority: 'low',
          icon: '🏆'
        })
      }

      setUpcomingExams(examsList)
      setNotifications(notifications.slice(0, 5)) // Limitar a 5 notificações
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks * 100).toFixed(1) : 0
  
  // Sistema de níveis dinâmico baseado em pontos
  const calculateLevel = (points) => {
    if (points < 100) return { level: 1, minXP: 0, maxXP: 100 }
    if (points < 300) return { level: 2, minXP: 100, maxXP: 300 }
    if (points < 600) return { level: 3, minXP: 300, maxXP: 600 }
    if (points < 1000) return { level: 4, minXP: 600, maxXP: 1000 }
    if (points < 1500) return { level: 5, minXP: 1000, maxXP: 1500 }
    
    // Para níveis superiores, cada nível requer +500 XP
    const extraLevels = Math.floor((points - 1500) / 500)
    const currentLevel = 6 + extraLevels
    const minXP = 1500 + (extraLevels * 500)
    const maxXP = minXP + 500
    
    return { level: currentLevel, minXP, maxXP }
  }

  const levelInfo = calculateLevel(stats.totalPoints)
  const progressInLevel = ((stats.totalPoints - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Dashboard - PSQ Pedro Study Quest</h1>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Progresso atualizado automaticamente • {new Date().toLocaleTimeString('pt-BR')}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <BookOpen size={24} style={{ color: '#6366f1', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.totalSubjects}</div>
          <div className="stat-label">Disciplinas</div>
        </div>
        
        <div className="stat-card">
          <Clock size={24} style={{ color: '#059669', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.totalTasks}</div>
          <div className="stat-label">Tasks Totais</div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={24} style={{ color: '#dc2626', marginBottom: '0.5rem' }} />
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Conclusão</div>
        </div>
        
        <div className="stat-card">
          <Trophy size={24} style={{ color: '#d97706', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.totalPoints}</div>
          <div className="stat-label">Pontos</div>
        </div>
      </div>

      {/* Central de Notificações */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">🔔 Central de Notificações</h2>
        
        {notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map(notification => (
              <div 
                key={notification.id}
                style={{
                  background: notification.priority === 'high' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' :
                            notification.priority === 'medium' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                            'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>
                  {notification.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {notification.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    {notification.message}
                  </div>
                </div>
                {notification.type === 'exam' && (
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {new Date(notification.date).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            padding: '2rem',
            fontSize: '1rem'
          }}>
            🎉 Nenhuma notificação no momento!
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Você está em dia com seus estudos.
            </div>
          </div>
        )}
      </div>

      {/* Provas Cadastradas */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">� Próximas Provas</h2>
        
        {upcomingExams.length > 0 ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {upcomingExams.slice(0, 3).map((exam, index) => (
              <div 
                key={index}
                style={{
                  background: exam.daysLeft <= 2 ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                            exam.daysLeft <= 5 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' :
                            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {exam.titulo}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    {exam.subjectName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {new Date(exam.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold'
                  }}>
                    {exam.daysLeft} {exam.daysLeft === 1 ? 'dia' : 'dias'}
                  </div>
                </div>
              </div>
            ))}
            {upcomingExams.length > 3 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                fontSize: '0.875rem',
                padding: '0.5rem'
              }}>
                +{upcomingExams.length - 3} prova(s) adicional(is)
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            padding: '2rem',
            fontSize: '1rem'
          }}>
            📅 Nenhuma prova nos próximos 7 dias
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Cadastre suas provas nas disciplinas para visualizá-las aqui.
            </div>
          </div>
        )}
      </div>
      {/* Disciplinas */}
      <div className="card">
        <h2 className="card-title">📚 Suas Disciplinas</h2>
        {recentSubjects.length > 0 ? (
          <div className="grid grid-3" style={{ marginTop: '1rem' }}>
            {recentSubjects.map((subject) => (
              <div 
                key={subject.id} 
                className="card"
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))'
                }}
                onClick={() => {
                  console.log('Dashboard - Clicando na disciplina:', subject)
                  onSelectSubject(subject)
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>{subject.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {subject.description || 'Clique para ver detalhes e gerenciar tasks'}
                </p>
                {subject.schedule && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#8b5cf6',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem'
                  }}>
                    {subject.schedule.map((sched, index) => (
                      <span key={index} style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}>
                        {sched.day} {sched.time}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  borderRadius: '0.25rem',
                  textAlign: 'center',
                  color: '#6366f1',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Abrir Kanban →
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Nenhuma disciplina cadastrada ainda.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Vá em "Disciplinas" para começar a adicionar suas matérias!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
