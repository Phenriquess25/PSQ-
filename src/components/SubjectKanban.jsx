import { useState, useEffect, useCallback } from 'react'
import { db } from '../db/simpleStorage'
import { Plus, ArrowLeft, Clock, Award, Brain } from 'lucide-react'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  useDroppable 
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TASK_STATUS = {
  todo: { title: 'A Fazer', color: '#6b7280' },
  doing: { title: 'Fazendo', color: '#f59e0b' },
  done: { title: 'Concluído', color: '#10b981' }
}

function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const difficultyColors = {
    1: 'difficulty-1',
    2: 'difficulty-2', 
    3: 'difficulty-3'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${difficultyColors[task.difficulty] || 'difficulty-2'}`}
    >
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-meta">
        <span className="task-difficulty">
          <Brain size={14} />
          Nível {task.difficulty}
        </span>
        <span className="task-time">
          <Clock size={14} />
          {task.estimatedTime}min
        </span>
        {task.points && (
          <span className="task-points">
            <Award size={14} />
            {task.points}pts
          </span>
        )}
      </div>
    </div>
  )
}

function DroppableColumn({ children, id, title, color, count }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div 
      ref={setNodeRef}
      className="kanban-column"
      style={{
        background: isOver ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.7)',
        transition: 'background-color 0.2s ease'
      }}
    >
      <div className="kanban-header">
        <div className="kanban-title" style={{ color }}>
          {title}
        </div>
        <div className="task-count" style={{ background: color }}>
          {count}
        </div>
      </div>
      {children}
    </div>
  )
}

function SubjectKanban({ subjectId, onBack }) {
  console.log('SubjectKanban - Componente renderizado com subjectId:', subjectId, 'tipo:', typeof subjectId)
  
  const [subject, setSubject] = useState(null)
  const [taskList, setTaskList] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 3,
    estimatedTime: 60
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    console.log('SubjectKanban - useEffect executado com subjectId:', subjectId)
    if (subjectId) {
      console.log('SubjectKanban - Chamando loadSubjectAndTasks...')
      loadSubjectAndTasks()
    } else {
      console.log('SubjectKanban - subjectId é null/undefined')
    }
  }, [subjectId])

  const loadSubjectAndTasks = async () => {
    if (!subjectId) {
      console.log('SubjectKanban - loadSubjectAndTasks: Nenhum subjectId fornecido')
      return
    }
    console.log('SubjectKanban - loadSubjectAndTasks: Carregando dados para ID:', subjectId)
    try {
      const numericId = parseInt(subjectId)
      console.log('SubjectKanban - loadSubjectAndTasks: ID convertido para número:', numericId)
      
      if (isNaN(numericId)) {
        console.error('SubjectKanban - loadSubjectAndTasks: ID inválido:', subjectId)
        return
      }
      
      const subjectData = await db.subjects.findById(numericId)
      console.log('SubjectKanban - loadSubjectAndTasks: Subject carregado:', subjectData)
      
      if (!subjectData) {
        console.error('SubjectKanban - loadSubjectAndTasks: Subject não encontrado para ID:', numericId)
        return
      }
      
      setSubject(subjectData)
      
      const tasks = await db.tasks.findMany({ subjectId: numericId })
      console.log('SubjectKanban - loadSubjectAndTasks: Tasks carregadas:', tasks)
      setTaskList(tasks)
    } catch (error) {
      console.error('SubjectKanban - loadSubjectAndTasks: Erro ao carregar dados:', error)
    }
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault()
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
      
      setFormData({ title: '', description: '', difficulty: 3, estimatedTime: 60 })
      setShowTaskForm(false)
      loadSubjectAndTasks()
    } catch (error) {
      console.error('Erro ao criar task:', error)
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const taskId = active.id
    const newStatus = over.id

    if (['todo', 'doing', 'done'].includes(newStatus)) {
      try {
        await db.tasks.update(taskId, { status: newStatus })
        loadSubjectAndTasks()
      } catch (error) {
        console.error('Erro ao atualizar status da task:', error)
      }
    }
  }

  const getTasksByStatus = (status) => {
    return taskList.filter(task => task.status === status)
  }

  const activeTask = activeId ? taskList.find(task => task.id === activeId) : null

  if (!subjectId) {
    console.log('SubjectKanban - Nenhum subjectId fornecido, mostrando tela de loading')
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Nenhuma disciplina selecionada para o Kanban...</p>
      </div>
    )
  }

  if (!subject) {
    console.log('SubjectKanban - Subject ainda não carregado, mostrando loading...')
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Carregando disciplina...</p>
      </div>
    )
  }

  console.log('SubjectKanban - Renderizando Kanban para subject:', subject.name)
  return (
    <div>
      <div className="card-header">
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>📝 Kanban - {subject.name}</h1>
        <button 
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Nova Task
        </button>
      </div>

      {/* Formulário de Nova Task */}
      {showTaskForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">➕ Criar Nova Task</h2>
          <form onSubmit={handleSubmitTask}>
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Estudar Capítulo 1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva a task..."
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Dificuldade:</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
                >
                  <option value={1}>🟢 Fácil</option>
                  <option value={2}>🟡 Médio</option>
                  <option value={3}>🔴 Difícil</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Tempo Estimado (minutos):</label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                  min="15"
                  step="15"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Criar Task</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowTaskForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {Object.entries(TASK_STATUS).map(([status, config]) => {
            const tasks = getTasksByStatus(status)
            return (
              <DroppableColumn
                key={status}
                id={status}
                title={config.title}
                color={config.color}
                count={tasks.length}
              >
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                  <div className="kanban-tasks">
                    {tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </DroppableColumn>
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Estatísticas */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title">📊 Estatísticas da Disciplina</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{taskList.length}</div>
            <div className="stat-label">Total de Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{getTasksByStatus('done').length}</div>
            <div className="stat-label">Concluídas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {taskList.length > 0 ? Math.round((getTasksByStatus('done').length / taskList.length) * 100) : 0}%
            </div>
            <div className="stat-label">Progresso</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {getTasksByStatus('done').reduce((sum, task) => sum + (task.points || 0), 0)}
            </div>
            <div className="stat-label">Pontos Ganhos</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectKanban
