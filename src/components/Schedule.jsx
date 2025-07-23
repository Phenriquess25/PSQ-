import { useState, useEffect } from 'react'
import { db } from '../db/simpleStorage'
import { Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'

function Schedule({ onSubjectClick }) {
  const [schedule, setSchedule] = useState({})
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [showExamsModal, setShowExamsModal] = useState(false)

  const daysOfWeek = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
  const timeSlots = [
    '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', 
    '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
    '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00',
    '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'
  ]

  useEffect(() => {
    loadScheduleData()
  }, []) // Carregar dados apenas uma vez

  const loadScheduleData = async () => {
    try {
      const subjectList = await db.subjects.findMany()
      setSubjects(subjectList)
      
      // Criar mapa de horários das aulas
      const scheduleMap = {}
      const examsList = []
      
      subjectList.forEach(subject => {
        // Processar horários de aulas
        if (subject.schedule && Array.isArray(subject.schedule)) {
          subject.schedule.forEach(sched => {
            // Mapear dias completos para abreviações
            const dayMap = {
              'Segunda': 'SEG', 'Terça': 'TER', 'Quarta': 'QUA', 
              'Quinta': 'QUI', 'Sexta': 'SEX', 'Sábado': 'SAB'
            }
            const dayAbbr = dayMap[sched.day] || sched.day
            
            // Criar entrada para slot de tempo correspondente
            if (sched.startTime && sched.endTime) {
              const startHour = parseInt(sched.startTime.split(':')[0])
              const endHour = parseInt(sched.endTime.split(':')[0])
              
              // Encontrar o slot de tempo correspondente
              for (let hour = startHour; hour < endHour; hour++) {
                const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`
                const key = `${dayAbbr}-${timeSlot}`
                
                scheduleMap[key] = {
                  subject: subject.name,
                  professor: subject.professor,
                  subjectId: subject.id,
                  startTime: sched.startTime,
                  endTime: sched.endTime,
                  isFirst: hour === startHour,
                  isLast: hour === endHour - 1,
                  hasExam: subject.provas && subject.provas.length > 0,
                  totalHours: endHour - startHour,
                  currentHour: hour - startHour + 1
                }
              }
            }
          })
        }
        
        // Processar todas as provas (sem filtro de data)
        if (subject.provas && Array.isArray(subject.provas)) {
          subject.provas.forEach(prova => {
            if (prova.data) {
              examsList.push({
                ...prova,
                subjectName: subject.name,
                subjectId: subject.id,
                type: 'prova'
              })
            }
          })
        }
      })
      
      setSchedule(scheduleMap)
      setExams(examsList)
      
      console.log(`Agenda - Total de aulas: ${Object.keys(scheduleMap).filter(key => scheduleMap[key].isFirst).length}`)
      console.log(`Agenda - Total de provas: ${examsList.length}`)
    } catch (error) {
      console.error('Erro ao carregar agenda:', error)
    }
  }

  // Função para verificar se uma aula está acontecendo agora
  const isClassNow = (day, startTime, endTime) => {
    const now = new Date()
    const currentDayName = daysOfWeek[now.getDay() - 1] // Converter número do dia para nome
    
    if (currentDayName !== day) return false

    const [hStart, mStart] = startTime.split(':').map(Number)
    const [hEnd, mEnd] = endTime.split(':').map(Number)

    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const startMinutes = hStart * 60 + mStart
    const endMinutes = hEnd * 60 + mEnd

    return nowMinutes >= startMinutes && nowMinutes <= endMinutes
  }

  // Função para verificar se é hoje
  const isToday = (dayName) => {
    const now = new Date()
    const dayMap = {
      'SEG': 1, 'TER': 2, 'QUA': 3, 'QUI': 4, 'SEX': 5, 'SAB': 6
    }
    return now.getDay() === dayMap[dayName]
  }

  // Função para verificar se uma disciplina tem provas próximas
  const getUpcomingExams = (subjectId) => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return exams.filter(exam => {
      const examDate = new Date(exam.data)
      return exam.subjectId === subjectId && examDate >= today && examDate <= nextWeek
    })
  }

  // Função para lidar com clique na célula (apenas visualizar)
  const handleCellClick = (scheduleItem) => {
    if (scheduleItem && onSubjectClick) {
      onSubjectClick(scheduleItem.subjectId)
    }
  }

  // Contar total de aulas
  const totalClasses = Object.keys(schedule).filter(key => 
    schedule[key].isFirst
  ).length

  // Contar provas próximas (próximos 7 dias)
  const upcomingExams = exams.filter(exam => {
    const examDate = new Date(exam.data)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return examDate >= today && examDate <= nextWeek
  }).length

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">📅 Grade de Horários</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-badge">
            {totalClasses} aulas cadastradas
          </div>
          <div 
            className="stat-badge" 
            style={{ 
              background: upcomingExams > 0 ? '#fbbf24' : 'rgba(34, 197, 94, 0.1)',
              color: upcomingExams > 0 ? 'white' : '#059669',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onClick={() => setShowExamsModal(true)}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            title="Clique para ver detalhes das provas"
          >
            {upcomingExams} provas próximas
          </div>
        </div>
      </div>

      {/* Grade de horários */}
      <div className="card">
        <div className="schedule-grid">
          {/* Cabeçalho TIME */}
          <div className="time-header" style={{ 
            background: '#f8fafc',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            color: '#374151',
            border: '1px solid #e5e7eb'
          }}>
            HORÁRIO
          </div>
          
          {/* Cabeçalhos dos dias */}
          {daysOfWeek.map(day => (
            <div 
              key={day} 
              className={`day-header ${isToday(day) ? 'today-highlight' : ''}`}
              style={{
                background: isToday(day) ? '#ddd6fe' : '#f8fafc',
                color: isToday(day) ? '#5b21b6' : '#374151',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                border: isToday(day) ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                textAlign: 'center',
                padding: '0.75rem 0.5rem'
              }}
            >
              {day}
            </div>
          ))}
          
          {/* Slots de tempo */}
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} style={{ display: 'contents' }}>
              <div 
                className="time-slot"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  padding: '0.75rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500',
                  textAlign: 'center'
                }}
              >
                {timeSlot}
              </div>
              {daysOfWeek.map(day => {
                const key = `${day}-${timeSlot}`
                const scheduleItem = schedule[key]
                const isNow = scheduleItem && isClassNow(day, scheduleItem.startTime, scheduleItem.endTime)
                
                // Determinar a cor de fundo baseada na posição na aula
                let backgroundColor = '#ffffff'
                let borderStyle = '1px solid #e5e7eb'
                
                if (scheduleItem) {
                  // Cor do sidebar (roxo/azul)
                  backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  
                  if (isNow) {
                    backgroundColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  }
                  
                  // Remover bordas internas entre células da mesma aula
                  if (!scheduleItem.isFirst) {
                    borderStyle = '1px solid #e5e7eb'
                    borderStyle = borderStyle.replace('border-top', 'border-top: none')
                  }
                  if (!scheduleItem.isLast) {
                    borderStyle = '1px solid #e5e7eb'
                    borderStyle = borderStyle.replace('border-bottom', 'border-bottom: none')  
                  }
                }
                
                return (
                  <div 
                    key={key} 
                    className={`schedule-cell ${scheduleItem ? 'has-class' : ''} ${isNow ? 'current-class' : ''}`}
                    style={{
                      background: scheduleItem ? backgroundColor : '#ffffff',
                      border: borderStyle,
                      borderTop: scheduleItem && !scheduleItem.isFirst ? 'none' : '1px solid #e5e7eb',
                      borderBottom: scheduleItem && !scheduleItem.isLast ? 'none' : '1px solid #e5e7eb',
                      padding: '0.5rem',
                      cursor: scheduleItem ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      minHeight: '60px',
                      position: 'relative'
                    }}
                    onClick={() => handleCellClick(scheduleItem)}
                  >
                    {scheduleItem && scheduleItem.isFirst && (
                      <div 
                        style={{
                          fontSize: window.innerWidth <= 480 ? '0.5rem' : window.innerWidth <= 768 ? '0.55rem' : '0.75rem',
                          lineHeight: '1.1',
                          color: 'white',
                          fontWeight: '600',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                          width: '90%',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ marginBottom: '4px' }}>
                          {scheduleItem.subject}
                          {getUpcomingExams(scheduleItem.subjectId).length > 0 && (
                            <div style={{ 
                              marginTop: '2px',
                              fontSize: window.innerWidth <= 480 ? '0.45rem' : '0.6rem',
                              background: '#fbbf24',
                              color: 'white',
                              padding: '0.1rem 0.2rem',
                              borderRadius: '0.2rem',
                              fontWeight: 'bold',
                              display: 'inline-block'
                            }}>
                              🚨 PROVA
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: window.innerWidth <= 480 ? '0.45rem' : '0.55rem', opacity: 0.9 }}>
                          {scheduleItem.professor}
                        </div>
                        <div style={{ fontSize: window.innerWidth <= 480 ? '0.4rem' : '0.5rem', opacity: 0.8, marginTop: '1px' }}>
                          {scheduleItem.startTime} - {scheduleItem.endTime}
                        </div>
                        {/* Mostrar detalhes da prova se houver */}
                        {getUpcomingExams(scheduleItem.subjectId).length > 0 && (
                          <div style={{ 
                            fontSize: window.innerWidth <= 480 ? '0.4rem' : '0.55rem', 
                            color: 'white',
                            marginTop: '2px',
                            fontWeight: 'bold',
                            background: '#fbbf24',
                            padding: '0.05rem 0.15rem',
                            borderRadius: '0.15rem'
                          }}>
                            {getUpcomingExams(scheduleItem.subjectId)[0] && (
                              <div>
                                📅 {new Date(getUpcomingExams(scheduleItem.subjectId)[0].data).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Provas Próximas */}
      {showExamsModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowExamsModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>📚 Provas Próximas</h2>
              <button 
                onClick={() => setShowExamsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {exams.filter(exam => {
              const examDate = new Date(exam.data)
              const today = new Date()
              const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
              return examDate >= today && examDate <= nextWeek
            }).length > 0 ? (
              <div>
                {exams.filter(exam => {
                  const examDate = new Date(exam.data)
                  const today = new Date()
                  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                  return examDate >= today && examDate <= nextWeek
                }).map((exam, index) => (
                  <div 
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      🚨 {exam.titulo}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      📚 Disciplina: {exam.subjectName}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      📅 Data: {new Date(exam.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      opacity: 0.9,
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      marginTop: '0.5rem'
                    }}>
                      ⏰ {Math.ceil((new Date(exam.data) - new Date()) / (1000 * 60 * 60 * 24))} dias restantes
                    </div>
                    {exam.descricao && (
                      <div style={{ 
                        fontSize: '0.85rem', 
                        marginTop: '0.5rem',
                        fontStyle: 'italic',
                        opacity: 0.9
                      }}>
                        "{exam.descricao}"
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
                🎉 Nenhuma prova nos próximos 7 dias!
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Você está em dia com seus estudos.
                </div>
              </div>
            )}

            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem',
              background: '#f3f4f6',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              💡 Dica: Cadastre suas provas nas disciplinas para receber lembretes automáticos!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule
