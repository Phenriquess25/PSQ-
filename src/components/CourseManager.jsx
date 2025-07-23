import { useState, useEffect } from 'react'
import { db } from '../db/simpleStorage'
import { Plus, BookOpen, Clock, Edit, Trash2 } from 'lucide-react'

function SubjectManager({ onSubjectClick }) {
  const [subjectList, setSubjectList] = useState([])
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    professor: '',
    schedule: []
  })
  const [newSchedule, setNewSchedule] = useState({ day: '', startTime: '', endTime: '' })

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const subjects = await db.subjects.findMany()
      setSubjectList(subjects)
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error)
    }
  }

  const handleSubmitSubject = async (e) => {
    e.preventDefault()
    try {
      await db.subjects.create({
        name: formData.name,
        description: formData.description,
        professor: formData.professor,
        schedule: formData.schedule
      })
      
      setFormData({ name: '', description: '', professor: '', schedule: [] })
      setShowSubjectForm(false)
      loadSubjects()
    } catch (error) {
      console.error('Erro ao criar disciplina:', error)
    }
  }

  const addSchedule = () => {
    if (newSchedule.day && newSchedule.startTime && newSchedule.endTime) {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, { ...newSchedule }]
      })
      setNewSchedule({ day: '', startTime: '', endTime: '' })
    }
  }

  const removeSchedule = (index) => {
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index)
    setFormData({ ...formData, schedule: updatedSchedule })
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">📚 Gerenciar Disciplinas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowSubjectForm(true)}
        >
          <Plus size={16} />
          Nova Disciplina
        </button>
      </div>

      {/* Formulário de Disciplina */}
      {showSubjectForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Nova Disciplina</h2>
          <form onSubmit={handleSubmitSubject}>
            <div className="form-group">
              <label className="form-label">Nome da Disciplina</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ex: Calculo II"
                required
                style={{ color: '#000000' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professor</label>
              <input
                type="text"
                className="form-input"
                value={formData.professor}
                onChange={(e) => setFormData({...formData, professor: e.target.value})}
                placeholder="ex: Prof. João Silva"
                style={{ color: '#000000' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-input form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição da disciplina..."
                style={{ color: '#000000' }}
              />
            </div>

            {/* Horários */}
            <div className="form-group">
              <label className="form-label">Horários das Aulas</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr auto', 
                gap: '0.5rem', 
                alignItems: 'end',
                marginBottom: '1rem'
              }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.875rem' }}>Dia</label>
                  <select
                    className="form-input"
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
                    style={{ color: '#000000' }}
                  >
                    <option value="">Selecione o dia</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.875rem' }}>Início</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                    style={{ color: '#000000' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.875rem' }}>Fim</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                    style={{ color: '#000000' }}
                  />
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={addSchedule}
                  disabled={!newSchedule.day || !newSchedule.startTime || !newSchedule.endTime}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Lista de horários adicionados */}
              {formData.schedule.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Horários cadastrados:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {formData.schedule.map((sched, index) => (
                      <div 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'rgba(99, 102, 241, 0.1)',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <span>{sched.day}: {sched.startTime} - {sched.endTime}</span>
                        <button
                          type="button"
                          onClick={() => removeSchedule(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            padding: '0.125rem'
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Criar Disciplina</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowSubjectForm(false)
                  setFormData({ name: '', description: '', professor: '', schedule: [] })
                  setNewSchedule({ day: '', startTime: '', endTime: '' })
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Disciplinas */}
      <div className="grid" style={{ gap: '1rem' }}>
        {subjectList.map((subject) => (
          <div 
            key={subject.id} 
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => onSubjectClick && onSubjectClick(subject.id)}
          >
            <div className="card-header">
              <h2 className="card-title">{subject.name}</h2>
              <button 
                type="button"
                className="btn-remove"
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  
                  if (confirm(`Excluir a disciplina "${subject.name}"? Esta ação não pode ser desfeita.`)) {
                    try {
                      await db.subjects.delete(subject.id)
                      loadSubjects() // Recarrega a lista
                      alert('Disciplina excluída com sucesso!')
                    } catch (error) {
                      console.error('Erro ao excluir:', error)
                      alert('Erro ao excluir disciplina!')
                    }
                  }
                }}
                title="Excluir disciplina"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            {subject.description && (
              <p style={{ color: '#000000ff', marginBottom: '1rem' }}>
                {subject.description}
              </p>
            )}

            {/* Professor */}
            {subject.professor && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#000000ff',
                  marginBottom: '0.25rem'
                }}>
                  👨‍🏫 Professor: {subject.professor}
                </div>
              </div>
            )}

            {/* Horários da Disciplina */}
            {subject.schedule && subject.schedule.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#27282bff',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Clock size={16} />
                  Horários:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {subject.schedule.map((sched, index) => (
                    <span 
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        color: '#6366f1',
                        fontWeight: '500',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}
                    >
                      {sched.day}: {sched.startTime} - {sched.endTime}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {subjectList.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h2 style={{ color: '#090909ff', marginBottom: '0.5rem' }}>Nenhuma disciplina cadastrada</h2>
          <p style={{ color: '#444545ff', marginBottom: '1.5rem' }}>
            Comece criando sua primeira disciplina e definindo os horários das aulas.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowSubjectForm(true)}
          >
            <Plus size={16} />
            Criar Primeira Disciplina
          </button>
        </div>
      )}
    </div>
  )
}

export default SubjectManager
