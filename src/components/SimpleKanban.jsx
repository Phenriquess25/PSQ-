import React, { useState, useEffect } from 'react'
import { db } from '../db/simpleStorage'
import { Plus, ArrowLeft, Clock, Award, Brain, Trash2 } from 'lucide-react'

const TASK_STATUS = {
  todo: { title: 'A Fazer', color: '#6b7280' },
  doing: { title: 'Fazendo', color: '#f59e0b' },
  done: { title: 'Concluído', color: '#10b981' }
}

function SimpleTaskCard({ task, onStatusChange, onDelete }) {
  const difficultyColors = {
    1: '#10b981', // Verde
    2: '#f59e0b', // Amarelo
    3: '#ef4444'  // Vermelho
  }

  return (
    <div className="task-card" style={{ 
      border: `2px solid ${difficultyColors[task.difficulty] || '#6b7280'}`,
      marginBottom: '0.75rem',
      padding: '1rem',
      borderRadius: '0.5rem',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
        {task.title}
      </h3>
      {task.description && (
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
          {task.description}
        </p>
      )}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Brain size={12} />
            Nível {task.difficulty}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            {task.estimatedTime}min
          </span>
          {task.points && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={12} />
              {task.points}pts
            </span>
          )}
        </div>
        <button 
          onClick={() => onDelete(task.id)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ef4444', 
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {/* Botões de Status */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '0.5rem', 
        marginTop: '0.75rem' 
      }}>
        {Object.entries(TASK_STATUS).map(([status, info]) => (
          <button
            key={status}
            onClick={() => onStatusChange(task.id, status)}
            style={{
              padding: '0.5rem 0.75rem',
              border: task.status === status ? `2px solid ${info.color}` : '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              background: task.status === status ? `${info.color}20` : 'white',
              color: task.status === status ? info.color : '#6b7280',
              fontSize: '0.75rem',
              fontWeight: task.status === status ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            {info.title}
          </button>
        ))}
      </div>
    </div>
  )
}

function SimpleKanban({ subjectId, onBack }) {
  console.log('SimpleKanban - Renderizado com subjectId:', subjectId)
  
  const [subject, setSubject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0) // Para forçar re-render
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 2,
    estimatedTime: 60
  })

  useEffect(() => {
    if (subjectId) {
      loadData()
    }
    
    // Listener para mudanças de dados
    const handleDataChange = (event) => {
      console.log('SimpleKanban - Dados mudaram via evento, recarregando...', event.detail)
      if (subjectId) {
        loadData()
      }
    }
    
    window.addEventListener('psq-data-changed', handleDataChange)
    
    return () => {
      window.removeEventListener('psq-data-changed', handleDataChange)
    }
  }, [subjectId])

  const loadData = async () => {
    try {
      console.log('SimpleKanban - Carregando dados para ID:', subjectId)
      const numericId = parseInt(subjectId)
      
      const subjectData = await db.subjects.findById(numericId)
      console.log('SimpleKanban - Subject carregado:', subjectData)
      setSubject(subjectData)
      
      const taskList = await db.tasks.findMany({ subjectId: numericId })
      console.log('SimpleKanban - Tasks carregadas:', taskList)
      setTasks(taskList)
    } catch (error) {
      console.error('SimpleKanban - Erro ao carregar dados:', error)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      const points = formData.difficulty * 10 + Math.floor(formData.estimatedTime / 15) * 5
      
      await db.tasks.create({
        subjectId: parseInt(subjectId),
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        estimatedTime: formData.estimatedTime,
        points: points,
        status: 'todo'
      })
      
      setFormData({ title: '', description: '', difficulty: 2, estimatedTime: 60 })
      setShowForm(false)
      loadData()
    } catch (error) {
      console.error('Erro ao criar task:', error)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      console.log('SimpleKanban - Alterando status da task', taskId, 'para', newStatus)
      await db.tasks.update(taskId, { status: newStatus })
      console.log('SimpleKanban - Status atualizado, recarregando dados...')
      await loadData() // Aguardar o carregamento
      setUpdateTrigger(prev => prev + 1) // Forçar re-render
      console.log('SimpleKanban - Dados recarregados e trigger atualizado')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (confirm('Tem certeza que deseja excluir esta task?')) {
      try {
        console.log('SimpleKanban - Deletando task', taskId)
        await db.tasks.delete(taskId)
        await loadData() // Aguardar o carregamento
        setUpdateTrigger(prev => prev + 1) // Forçar re-render
        console.log('SimpleKanban - Task deletada e dados recarregados')
      } catch (error) {
        console.error('Erro ao excluir task:', error)
      }
    }
  }

  const handleFinishSubject = async () => {
    const confirmMessage = `Tem certeza que deseja marcar "${subject.name}" como finalizada?\n\nIsso irá:\n• Marcar todas as tasks como concluídas\n• Marcar a disciplina como finalizada\n• Aumentar seus pontos significativamente`
    
    if (confirm(confirmMessage)) {
      try {
        console.log('SimpleKanban - Iniciando finalização da matéria')
        console.log('SimpleKanban - Subject ID:', subjectId, 'tipo:', typeof subjectId)
        
        // Carregar todas as tasks desta disciplina
        const allTasks = await db.tasks.findMany({ subjectId: parseInt(subjectId) })
        console.log('SimpleKanban - Tasks encontradas para finalizar:', allTasks)
        
        // Marcar todas as tasks como concluídas
        let updatedTasks = 0
        for (const task of allTasks) {
          if (task.status !== 'done') {
            console.log('SimpleKanban - Finalizando task:', task.id, task.title)
            const result = await db.tasks.update(task.id, { status: 'done' })
            console.log('SimpleKanban - Task atualizada:', result)
            updatedTasks++
          }
        }
        
        console.log('SimpleKanban - Total de tasks finalizadas:', updatedTasks)
        
        // Marcar a disciplina como finalizada
        const subjectResult = await db.subjects.update(parseInt(subjectId), { 
          finished: true,
          finishedAt: new Date().toISOString()
        })
        console.log('SimpleKanban - Disciplina atualizada:', subjectResult)
        
        // Recarregar dados
        await loadData()
        setUpdateTrigger(prev => prev + 1)
        
        // Feedback ao usuário
        const totalPoints = allTasks.reduce((sum, task) => sum + (task.points || 10), 0)
        alert(`🎉 Parabéns! Matéria finalizada com sucesso!\n\n📊 Estatísticas:\n• ${allTasks.length} tasks concluídas\n• ${totalPoints} pontos ganhos\n• ${updatedTasks} tasks atualizadas`)
        
        console.log('SimpleKanban - Matéria finalizada com sucesso')
      } catch (error) {
        console.error('SimpleKanban - Erro ao finalizar matéria:', error)
        alert(`Erro ao finalizar matéria: ${error.message}`)
      }
    }
  }

  if (!subject) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>⏳</div>
        <p>Carregando kanban...</p>
      </div>
    )
  }

  // Forçar recálculo dos contadores sempre que tasks mudarem
  const todoTasks = tasks.filter(t => t.status === 'todo')
  const doingTasks = tasks.filter(t => t.status === 'doing')  
  const doneTasks = tasks.filter(t => t.status === 'done')
  
  console.log('SimpleKanban - Contadores atualizados:', {
    todo: todoTasks.length,
    doing: doingTasks.length, 
    done: doneTasks.length,
    total: tasks.length
  })

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', flex: 1, textAlign: 'center' }}>
          📝 {subject.name}
          {subject.finished && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✅</span>}
        </h1>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            background: '#6366f1',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Nova Task
        </button>
      </div>

      {/* Botões de Ação */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {!subject.finished && (
          <>
            <button 
              onClick={handleFinishSubject}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#10b981',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              🎉 Finalizar Matéria
            </button>
            
            {/* Botão de Debug */}
            <button 
              onClick={() => {
                console.log('=== DEBUG FINALIZAR MATÉRIA ===')
                console.log('Subject atual:', subject)
                console.log('SubjectId:', subjectId, 'tipo:', typeof subjectId)
                console.log('Tasks atuais:', tasks)
                alert(`Debug:\nSubject: ${subject.name}\nID: ${subjectId}\nTasks: ${tasks.length}\nFinished: ${subject.finished}`)
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🐛 Debug
            </button>
          </>
        )}
        
        {subject.finished && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.5rem',
            background: '#d1fae5',
            color: '#065f46',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            ✅ Matéria Finalizada
            {subject.finishedAt && (
              <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                em {new Date(subject.finishedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={{ 
          background: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>➕ Nova Task</h3>
          <form onSubmit={handleCreateTask}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Título:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Estudar Capítulo 1"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem',
                  color: '#000000',
                  background: 'white',
                  '::placeholder': { color: '#000000', opacity: 0.7 }
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Descrição:
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva a task..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem',
                  resize: 'vertical',
                  color: '#000000',
                  background: 'white',
                  '::placeholder': { color: '#000000', opacity: 0.7 }
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Dificuldade:
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem',
                    color: '#000000',
                    background: 'white'
                  }}
                >
                  <option value={1}>🟢 Fácil</option>
                  <option value={2}>🟡 Médio</option>
                  <option value={3}>🔴 Difícil</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Tempo (min):
                </label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                  min="15"
                  max="480"
                  step="15"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem',
                    color: '#000000',
                    background: 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  background: '#10b981',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Criar Task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estatísticas */}
      <div 
        key={`stats-${tasks.length}-${todoTasks.length}-${doingTasks.length}-${doneTasks.length}`}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}
      >
        <div style={{ 
          padding: '0.75rem', 
          background: '#f3f4f6', 
          borderRadius: '0.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontWeight: '600', color: '#6b7280', fontSize: '1.25rem' }}>{todoTasks.length}</div>
          <div style={{ color: '#9ca3af' }}>A Fazer</div>
        </div>
        <div style={{ 
          padding: '0.75rem', 
          background: '#fef3c7', 
          borderRadius: '0.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontWeight: '600', color: '#f59e0b', fontSize: '1.25rem' }}>{doingTasks.length}</div>
          <div style={{ color: '#d97706' }}>Fazendo</div>
        </div>
        <div style={{ 
          padding: '0.75rem', 
          background: '#d1fae5', 
          borderRadius: '0.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontWeight: '600', color: '#10b981', fontSize: '1.25rem' }}>{doneTasks.length}</div>
          <div style={{ color: '#059669' }}>Concluído</div>
        </div>
      </div>

      {/* Tasks por Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* A Fazer */}
        <div>
          <h3 style={{ 
            margin: '0 0 0.75rem 0', 
            padding: '0.5rem 1rem',
            background: '#f3f4f6',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#6b7280'
          }}>
            📋 A Fazer ({todoTasks.length})
          </h3>
          {todoTasks.map(task => (
            <SimpleTaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
          {todoTasks.length === 0 && (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
              Nenhuma task para fazer
            </p>
          )}
        </div>

        {/* Fazendo */}
        <div>
          <h3 style={{ 
            margin: '0 0 0.75rem 0', 
            padding: '0.5rem 1rem',
            background: '#fef3c7',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#f59e0b'
          }}>
            ⚡ Fazendo ({doingTasks.length})
          </h3>
          {doingTasks.map(task => (
            <SimpleTaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
          {doingTasks.length === 0 && (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
              Nenhuma task em andamento
            </p>
          )}
        </div>

        {/* Concluído */}
        <div>
          <h3 style={{ 
            margin: '0 0 0.75rem 0', 
            padding: '0.5rem 1rem',
            background: '#d1fae5',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#10b981'
          }}>
            ✅ Concluído ({doneTasks.length})
          </h3>
          {doneTasks.map(task => (
            <SimpleTaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
          {doneTasks.length === 0 && (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
              Nenhuma task concluída
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimpleKanban
