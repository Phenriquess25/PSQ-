// Sistema de armazenamento simples com localStorage
const STORAGE_KEYS = {
  SUBJECTS: 'psq_subjects', 
  TASKS: 'psq_tasks',
  USER: 'psq_user'
}

// Função para limpar todos os dados
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  initDatabase()
  console.log('Todos os dados foram limpos!')
}

// Funções helper para localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error)
    return []
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
    return false
  }
}

// Simulação das funções do banco
export const db = {
  subjects: {
    async findMany() {
      return getFromStorage(STORAGE_KEYS.SUBJECTS)
    },
    
    async findById(id) {
      const subjects = getFromStorage(STORAGE_KEYS.SUBJECTS)
      return subjects.find(s => s.id === id)
    },
    
    async create(data) {
      const subjects = getFromStorage(STORAGE_KEYS.SUBJECTS)
      const newSubject = {
        id: Date.now(),
        ...data,
        ementa: data.ementa || '',
        assuntos: data.assuntos || [],
        provas: data.provas || [],
        createdAt: new Date().toISOString()
      }
      subjects.push(newSubject)
      saveToStorage(STORAGE_KEYS.SUBJECTS, subjects)
      return newSubject
    },
    
    async update(id, data) {
      const subjects = getFromStorage(STORAGE_KEYS.SUBJECTS)
      const index = subjects.findIndex(s => s.id === id)
      if (index !== -1) {
        subjects[index] = { ...subjects[index], ...data }
        saveToStorage(STORAGE_KEYS.SUBJECTS, subjects)
        return subjects[index]
      }
      return null
    },
    
    async delete(id) {
      const subjects = getFromStorage(STORAGE_KEYS.SUBJECTS)
      const filtered = subjects.filter(s => s.id !== parseInt(id))
      saveToStorage(STORAGE_KEYS.SUBJECTS, filtered)
      console.log(`Disciplina ${id} excluída com sucesso!`)
      return true
    }
  },
  
  tasks: {
    async findMany(filter = {}) {
      const tasks = getFromStorage(STORAGE_KEYS.TASKS)
      if (filter.subjectId) {
        return tasks.filter(t => t.subjectId === filter.subjectId)
      }
      return tasks
    },
    
    async create(data) {
      const tasks = getFromStorage(STORAGE_KEYS.TASKS)
      const newTask = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      }
      tasks.push(newTask)
      saveToStorage(STORAGE_KEYS.TASKS, tasks)
      return newTask
    },
    
    async update(id, data) {
      const tasks = getFromStorage(STORAGE_KEYS.TASKS)
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...data }
        saveToStorage(STORAGE_KEYS.TASKS, tasks)
        return tasks[index]
      }
      return null
    },

    async delete(id) {
      const tasks = getFromStorage(STORAGE_KEYS.TASKS)
      const filtered = tasks.filter(t => t.id !== id)
      saveToStorage(STORAGE_KEYS.TASKS, filtered)
      return true
    }
  }
}

// Função de inicialização simplificada
export async function initDatabase() {
  console.log('Inicializando banco de dados...')
  
  // Verificar se já existem dados
  const subjects = getFromStorage(STORAGE_KEYS.SUBJECTS)
  const tasks = getFromStorage(STORAGE_KEYS.TASKS)
  
  console.log(`Banco inicializado: ${subjects.length} disciplinas, ${tasks.length} tasks`)
  
  return true
}
