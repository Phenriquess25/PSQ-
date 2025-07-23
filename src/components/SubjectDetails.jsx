import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, BookOpen, Calendar, Clock, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { db } from '../db/simpleStorage'

export default function SubjectDetails({ subjectId, onBack, onKanban }) {
  const [subject, setSubject] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [isEditing, setIsEditing] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [newProva, setNewProva] = useState({ titulo: '', data: '', descricao: '' })
  const [newTask, setNewTask] = useState({ title: '', description: '', difficulty: 1, estimatedTime: 30 })

  useEffect(() => {
    if (subjectId) {
      loadSubject()
    }
  }, [subjectId])

  const loadSubject = useCallback(async () => {
    if (!subjectId) {
      console.log('SubjectDetails - Nenhum subjectId fornecido')
      return
    }
    
    console.log('SubjectDetails - Carregando subject com ID:', subjectId)
    try {
      const subjectData = await db.subjects.findById(parseInt(subjectId))
      console.log('SubjectDetails - Dados carregados:', subjectData)
      setSubject(subjectData)
    } catch (error) {
      console.error('Erro ao carregar disciplina:', error)
    }
  }, [subjectId])

  const updateSubject = async (updates) => {
    try {
      await db.subjects.update(parseInt(subjectId), updates)
      await loadSubject()
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error)
    }
  }

  const addAssunto = () => {
    if (newItem.trim()) {
      const assuntos = [...(subject.assuntos || []), { 
        text: newItem.trim(), 
        completed: false, 
        id: Date.now() 
      }]
      updateSubject({ assuntos })
      setNewItem('')
    }
  }

  const toggleAssunto = (index) => {
    console.log('Toggle assunto:', index) // Debug
    const assuntos = [...subject.assuntos]
    console.log('Assuntos antes:', assuntos[index]) // Debug
    assuntos[index].completed = !assuntos[index].completed
    console.log('Assuntos depois:', assuntos[index]) // Debug
    updateSubject({ assuntos })
  }

  const removeAssunto = (index) => {
    const assuntos = subject.assuntos.filter((_, i) => i !== index)
    updateSubject({ assuntos })
  }

  const addProva = () => {
    if (newProva.titulo && newProva.data) {
      const provas = [...(subject.provas || []), { 
        id: Date.now(),
        ...newProva,
        createdAt: new Date().toISOString()
      }]
      updateSubject({ provas })
      setNewProva({ titulo: '', data: '', descricao: '' })
    }
  }

  const removeProva = (provaId) => {
    const provas = subject.provas.filter(p => p.id !== provaId)
    updateSubject({ provas })
  }

  const createTask = async () => {
    if (newTask.title.trim()) {
      try {
        await db.tasks.create({
          ...newTask,
          subjectId: parseInt(subjectId),
          status: 'todo'
        })
        setNewTask({ title: '', description: '', difficulty: 1, estimatedTime: 30 })
        alert('Task criada com sucesso!')
      } catch (error) {
        console.error('Erro ao criar task:', error)
        alert('Erro ao criar task')
      }
    }
  }

  const getProvasProximas = () => {
    if (!subject?.provas) return []
    const hoje = new Date()
    const proximosDias = new Date()
    proximosDias.setDate(hoje.getDate() + 7)
    
    return subject.provas.filter(prova => {
      const dataProva = new Date(prova.data)
      return dataProva >= hoje && dataProva <= proximosDias
    })
  }

  const getProgressStats = () => {
    const totalAssuntos = subject?.assuntos?.length || 0
    const assuntosCompletos = subject?.assuntos?.filter(a => 
      typeof a === 'object' ? a.completed : false
    )?.length || 0
    
    const progressoAssuntos = totalAssuntos > 0 ? (assuntosCompletos / totalAssuntos) * 100 : 0
    
    return {
      totalAssuntos,
      assuntosCompletos,
      progressoAssuntos: Math.round(progressoAssuntos),
      totalProvas: subject?.provas?.length || 0
    }
  }

  if (!subjectId) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Nenhuma disciplina selecionada...</p>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Carregando disciplina...</p>
      </div>
    )
  }

  const proximasProvas = getProvasProximas()
  const progressStats = getProgressStats()

  return (
    <div className="subject-details">
      <div className="details-header">
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>{subject.name}</h1>
        <button 
          type="button"
          onClick={() => {
            console.log('SubjectDetails - Clicando em Abrir Kanban com subjectId:', subjectId)
            console.log('SubjectDetails - onKanban function:', typeof onKanban)
            console.log('SubjectDetails - subject atual:', subject)
            if (onKanban) {
              onKanban()
              console.log('SubjectDetails - onKanban() executado')
            } else {
              console.error('SubjectDetails - onKanban não está definido!')
            }
          }} 
          className="btn-kanban"
        >
          <BookOpen size={20} />
          Abrir Kanban
        </button>
        
        {/* Botão de Debug para teste direto */}
        <button 
          type="button"
          onClick={() => {
            console.log('=== DEBUG KANBAN ===')
            console.log('subjectId:', subjectId, 'tipo:', typeof subjectId)
            console.log('subject:', subject)
            console.log('onKanban:', typeof onKanban)
            alert(`Debug: subjectId=${subjectId}, subject=${subject?.name}`)
          }}
          className="btn"
          style={{ marginLeft: '0.5rem', fontSize: '0.8rem', background: '#f3f4f6' }}
        >
          🐛 Debug
        </button>
      </div>

      {proximasProvas.length > 0 && (
        <div className="alert-provas">
          <AlertTriangle size={20} />
          <span>Você tem {proximasProvas.length} prova(s) nos próximos 7 dias!</span>
        </div>
      )}

      {/* Estatísticas de Progresso */}
      <div className="progress-stats">
        <div className="progress-card">
          <div className="progress-item">
            <span className="progress-label">📚 Assuntos</span>
            <span className="progress-value">{progressStats.assuntosCompletos}/{progressStats.totalAssuntos}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressStats.progressoAssuntos}%` }}
            ></div>
          </div>
          <span className="progress-percent">{progressStats.progressoAssuntos}% concluído</span>
        </div>
        
        <div className="progress-card">
          <div className="progress-item">
            <span className="progress-label">📝 Provas</span>
            <span className="progress-value">{progressStats.totalProvas}</span>
          </div>
        </div>
      </div>

      <div className="details-tabs">
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Detalhes
        </button>
        <button 
          className={`tab ${activeTab === 'assuntos' ? 'active' : ''}`}
          onClick={() => setActiveTab('assuntos')}
        >
          Assuntos
        </button>
        <button 
          className={`tab ${activeTab === 'provas' ? 'active' : ''}`}
          onClick={() => setActiveTab('provas')}
        >
          Provas
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Criar Task
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="subject-info">
              <h3>Informações da Disciplina</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Professor:</strong> {subject.professor || 'Não informado'}
                </div>
                <div className="info-item">
                  <strong>Horários:</strong>
                  <div className="schedule-list">
                    {subject.schedule?.map((sched, index) => (
                      <span key={index} className="schedule-item">
                        {sched.day}: {sched.startTime} - {sched.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ementa-section">
              <div className="section-header">
                <h3>Ementa</h3>
                <button onClick={() => setIsEditing(!isEditing)} className="btn-edit">
                  <Edit2 size={16} />
                  {isEditing ? 'Salvar' : 'Editar'}
                </button>
              </div>
              {isEditing ? (
                <textarea
                  value={subject.ementa || ''}
                  onChange={(e) => setSubject({...subject, ementa: e.target.value})}
                  onBlur={() => {
                    updateSubject({ ementa: subject.ementa })
                    setIsEditing(false)
                  }}
                  placeholder="Digite a ementa da disciplina..."
                  rows={6}
                  className="ementa-textarea"
                />
              ) : (
                <div className="ementa-display">
                  {subject.ementa || 'Nenhuma ementa cadastrada. Clique em "Editar" para adicionar.'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assuntos' && (
          <div className="assuntos-tab">
            <div className="add-item">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Digite um novo assunto..."
                onKeyPress={(e) => e.key === 'Enter' && addAssunto()}
              />
              <button onClick={addAssunto} className="btn-add">
                <Plus size={16} />
                Adicionar
              </button>
            </div>
            
            <div className="items-list">
              {subject.assuntos?.map((assunto, index) => {
                const isCompleted = typeof assunto === 'object' ? assunto.completed : false
                const text = typeof assunto === 'object' ? assunto.text : assunto
                
                return (
                  <div key={index} className={`item-card ${isCompleted ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleAssunto(index)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ 
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        color: isCompleted ? '#6b7280' : '#1f2937'
                      }}>
                        {text}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeAssunto(index)}
                      className="btn-remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
              {(!subject.assuntos || subject.assuntos.length === 0) && (
                <p className="empty-state">Nenhum assunto cadastrado ainda.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'provas' && (
          <div className="provas-tab">
            <div className="add-prova">
              <h3>Adicionar Nova Prova</h3>
              <div className="prova-form">
                <input
                  type="text"
                  value={newProva.titulo}
                  onChange={(e) => setNewProva({...newProva, titulo: e.target.value})}
                  placeholder="Título da prova"
                />
                <input
                  type="date"
                  value={newProva.data}
                  onChange={(e) => setNewProva({...newProva, data: e.target.value})}
                />
                <textarea
                  value={newProva.descricao}
                  onChange={(e) => setNewProva({...newProva, descricao: e.target.value})}
                  placeholder="Descrição da prova (opcional)"
                  rows={3}
                />
                <button onClick={addProva} className="btn-add">
                  <Plus size={16} />
                  Adicionar Prova
                </button>
              </div>
            </div>

            <div className="provas-list">
              {subject.provas?.map((prova) => (
                <div key={prova.id} className="prova-card">
                  <div className="prova-header">
                    <h4>{prova.titulo}</h4>
                    <button 
                      onClick={() => removeProva(prova.id)}
                      className="btn-remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="prova-info">
                    <div className="prova-date">
                      <Calendar size={16} />
                      {new Date(prova.data).toLocaleDateString('pt-BR')}
                    </div>
                    {prova.descricao && (
                      <p className="prova-desc">{prova.descricao}</p>
                    )}
                  </div>
                </div>
              ))}
              {(!subject.provas || subject.provas.length === 0) && (
                <p className="empty-state">Nenhuma prova cadastrada ainda.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <h3>Criar Nova Task</h3>
            <div className="task-form">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Título da task"
              />
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Descrição da task"
                rows={3}
              />
              <div className="form-row">
                <div className="form-group">
                  <label>Dificuldade:</label>
                  <select
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask({...newTask, difficulty: parseInt(e.target.value)})}
                  >
                    <option value={1}>Fácil</option>
                    <option value={2}>Médio</option>
                    <option value={3}>Difícil</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tempo estimado (min):</label>
                  <input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value)})}
                    min={5}
                    step={5}
                  />
                </div>
              </div>
              <button onClick={createTask} className="btn-create-task">
                <Plus size={16} />
                Criar Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
