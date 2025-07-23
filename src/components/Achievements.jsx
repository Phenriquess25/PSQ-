import { useState, useEffect } from 'react'
import { db } from '../db/simpleStorage'
import { Trophy, Star, Target, Zap, Award, CheckCircle, Clock, BarChart3 } from 'lucide-react'

function Achievements() {
  const [stats, setStats] = useState({
    totalPoints: 0,
    completedTasks: 0,
    todoTasks: 0,
    doingTasks: 0,
    totalSubjects: 0,
    currentLevel: 1,
    progressToNext: 0
  })
  
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    loadAchievementsData()
  }, [])

  const loadAchievementsData = async () => {
    try {
      // Carregar dados básicos
      const subjectList = await db.subjects.findMany()
      const taskList = await db.tasks.findMany()
      
      const completedTasks = taskList.filter(task => task.status === 'done')
      const todoTasks = taskList.filter(task => task.status === 'todo')
      const doingTasks = taskList.filter(task => task.status === 'doing')
      const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 10), 0)
      
      // Calcular nível
      const levelInfo = calculateLevel(totalPoints)
      const progressToNext = ((totalPoints - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100

      const newStats = {
        totalPoints,
        completedTasks: completedTasks.length,
        todoTasks: todoTasks.length,
        doingTasks: doingTasks.length,
        totalSubjects: subjectList.length,
        currentLevel: levelInfo.level,
        progressToNext: Math.round(progressToNext)
      }

      setStats(newStats)
      generateAchievements(newStats)
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error)
    }
  }

  const calculateLevel = (points) => {
    if (points < 100) return { level: 1, minXP: 0, maxXP: 100 }
    if (points < 300) return { level: 2, minXP: 100, maxXP: 300 }
    if (points < 600) return { level: 3, minXP: 300, maxXP: 600 }
    if (points < 1000) return { level: 4, minXP: 600, maxXP: 1000 }
    if (points < 1500) return { level: 5, minXP: 1000, maxXP: 1500 }
    
    const extraLevels = Math.floor((points - 1500) / 500)
    const currentLevel = 6 + extraLevels
    const minXP = 1500 + (extraLevels * 500)
    const maxXP = minXP + 500
    
    return { level: currentLevel, minXP, maxXP }
  }

  const generateAchievements = (stats) => {
    const achievements = [
      // Conquistas de Pontos
      {
        id: 'points_100',
        title: 'Primeiros Passos',
        description: 'Alcance 100 pontos',
        icon: '🌟',
        progress: Math.min(stats.totalPoints, 100),
        target: 100,
        unlocked: stats.totalPoints >= 100,
        category: 'points'
      },
      {
        id: 'points_500',
        title: 'Estudante Dedicado',
        description: 'Alcance 500 pontos',
        icon: '⭐',
        progress: Math.min(stats.totalPoints, 500),
        target: 500,
        unlocked: stats.totalPoints >= 500,
        category: 'points'
      },
      {
        id: 'points_1000',
        title: 'Mestre dos Estudos',
        description: 'Alcance 1000 pontos',
        icon: '🏆',
        progress: Math.min(stats.totalPoints, 1000),
        target: 1000,
        unlocked: stats.totalPoints >= 1000,
        category: 'points'
      },

      // Conquistas de Tasks
      {
        id: 'tasks_10',
        title: 'Primeiro Concluído',
        description: 'Complete 10 tasks',
        icon: '✅',
        progress: Math.min(stats.completedTasks, 10),
        target: 10,
        unlocked: stats.completedTasks >= 10,
        category: 'tasks'
      },
      {
        id: 'tasks_50',
        title: 'Produtivo',
        description: 'Complete 50 tasks',
        icon: '🎯',
        progress: Math.min(stats.completedTasks, 50),
        target: 50,
        unlocked: stats.completedTasks >= 50,
        category: 'tasks'
      },
      {
        id: 'tasks_100',
        title: 'Máquina de Produtividade',
        description: 'Complete 100 tasks',
        icon: '⚡',
        progress: Math.min(stats.completedTasks, 100),
        target: 100,
        unlocked: stats.completedTasks >= 100,
        category: 'tasks'
      },

      // Conquistas de Nível
      {
        id: 'level_3',
        title: 'Subindo de Nível',
        description: 'Alcance o nível 3',
        icon: '📈',
        progress: Math.min(stats.currentLevel, 3),
        target: 3,
        unlocked: stats.currentLevel >= 3,
        category: 'level'
      },
      {
        id: 'level_5',
        title: 'Veterano',
        description: 'Alcance o nível 5',
        icon: '🎖️',
        progress: Math.min(stats.currentLevel, 5),
        target: 5,
        unlocked: stats.currentLevel >= 5,
        category: 'level'
      },
      {
        id: 'level_10',
        title: 'Lenda dos Estudos',
        description: 'Alcance o nível 10',
        icon: '👑',
        progress: Math.min(stats.currentLevel, 10),
        target: 10,
        unlocked: stats.currentLevel >= 10,
        category: 'level'
      }
    ]

    setAchievements(achievements)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'points': return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }
      case 'tasks': return { bg: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }
      case 'level': return { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white' }
      default: return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">🏆 Conquistas & Progresso</h1>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Acompanhe seu progresso e desbloqueie conquistas
        </div>
      </div>

      {/* Estatísticas de Progresso */}
      <div className="stats-grid">
        <div className="stat-card">
          <Trophy size={24} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.totalPoints}</div>
          <div className="stat-label">Pontos Totais</div>
        </div>
        
        <div className="stat-card">
          <CheckCircle size={24} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.completedTasks}</div>
          <div className="stat-label">Tasks Concluídas</div>
        </div>
        
        <div className="stat-card">
          <Clock size={24} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.doingTasks}</div>
          <div className="stat-label">Em Progresso</div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={24} style={{ color: '#6b7280', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats.todoTasks}</div>
          <div className="stat-label">A Fazer</div>
        </div>
      </div>

      {/* Progresso de Nível */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">📊 Progresso de Nível</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1' }}>
                Nível {stats.currentLevel}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {stats.progressToNext}% para o próximo nível
              </div>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '0.5rem', height: '12px' }}>
              <div 
                style={{ 
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', 
                  width: `${Math.max(2, stats.progressToNext)}%`, 
                  height: '100%', 
                  borderRadius: '0.5rem',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🎯</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Nível Atual</div>
          </div>
        </div>
      </div>

      {/* Conquistas Desbloqueadas */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">🎉 Conquistas Desbloqueadas ({unlockedAchievements.length})</h2>
        
        {unlockedAchievements.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {unlockedAchievements.map(achievement => {
              const colors = getCategoryColor(achievement.category)
              return (
                <div 
                  key={achievement.id}
                  style={{
                    background: colors.bg,
                    color: colors.color,
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    {achievement.icon}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    {achievement.description}
                  </div>
                  <div style={{ 
                    marginTop: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    ✅ CONQUISTADO
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            padding: '2rem',
            fontSize: '1rem'
          }}>
            🎯 Continue estudando para desbloquear suas primeiras conquistas!
          </div>
        )}
      </div>

      {/* Próximas Conquistas */}
      <div className="card">
        <h2 className="card-title">🔒 Próximas Conquistas ({lockedAchievements.length})</h2>
        
        {lockedAchievements.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {lockedAchievements.map(achievement => (
              <div 
                key={achievement.id}
                style={{
                  background: '#f8fafc',
                  border: '2px dashed #e5e7eb',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  opacity: 0.7
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>
                  {achievement.icon}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                  {achievement.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                  {achievement.description}
                </div>
                <div style={{ 
                  background: '#e5e7eb', 
                  borderRadius: '0.5rem', 
                  height: '8px',
                  marginBottom: '0.5rem'
                }}>
                  <div 
                    style={{ 
                      background: 'linear-gradient(90deg, #6b7280, #9ca3af)', 
                      width: `${(achievement.progress / achievement.target) * 100}%`, 
                      height: '100%', 
                      borderRadius: '0.5rem',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: 'bold'
                }}>
                  {achievement.progress}/{achievement.target} - {Math.round((achievement.progress / achievement.target) * 100)}%
                </div>
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
            🎉 Parabéns! Você desbloqueou todas as conquistas disponíveis!
          </div>
        )}
      </div>
    </div>
  )
}

export default Achievements
