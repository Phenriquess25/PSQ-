// Script para criar tasks de teste e testar a barra de progresso
import { db, initDatabase } from './src/db/simpleStorage.js'

async function createTestTasks() {
  console.log('Inicializando banco...')
  await initDatabase()
  
  console.log('Verificando disciplinas...')
  const subjects = await db.subjects.findMany()
  
  if (subjects.length === 0) {
    console.log('Nenhuma disciplina encontrada, criando uma de teste...')
    const testSubject = await db.subjects.create({
      name: 'Matemática Avançada',
      description: 'Disciplina de teste para progress bar',
      professor: 'Prof. Teste',
      schedule: [{ day: 'Segunda', startTime: '08:00', endTime: '10:00' }]
    })
    subjects.push(testSubject)
  }
  
  const subjectId = subjects[0].id
  console.log('Usando disciplina ID:', subjectId)
  
  // Criar algumas tasks
  const tasks = [
    { title: 'Estudar Capítulo 1', difficulty: 1, estimatedTime: 60, status: 'done' },
    { title: 'Resolver Exercícios 1-10', difficulty: 2, estimatedTime: 90, status: 'done' },
    { title: 'Estudar Capítulo 2', difficulty: 2, estimatedTime: 75, status: 'done' },
    { title: 'Projeto Final', difficulty: 3, estimatedTime: 180, status: 'doing' },
    { title: 'Prova Simulada', difficulty: 3, estimatedTime: 120, status: 'todo' }
  ]
  
  console.log('Criando tasks...')
  for (const taskData of tasks) {
    const points = taskData.difficulty * 10 + Math.floor(taskData.estimatedTime / 15) * 5
    await db.tasks.create({
      subjectId: subjectId,
      title: taskData.title,
      description: `Task de teste - ${taskData.title}`,
      difficulty: taskData.difficulty,
      estimatedTime: taskData.estimatedTime,
      points: points,
      status: taskData.status
    })
    console.log(`Task criada: ${taskData.title} (${points} pontos, status: ${taskData.status})`)
  }
  
  console.log('Tasks de teste criadas com sucesso!')
  
  // Verificar estatísticas
  const allTasks = await db.tasks.findMany()
  const completedTasks = allTasks.filter(t => t.status === 'done')
  const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 10), 0)
  
  console.log('Estatísticas:')
  console.log('- Total de tasks:', allTasks.length)
  console.log('- Tasks completas:', completedTasks.length)
  console.log('- Total de pontos:', totalPoints)
}

// Executar se for chamado diretamente
if (typeof window !== 'undefined') {
  window.createTestTasks = createTestTasks
  console.log('Função createTestTasks disponível no console')
}

export { createTestTasks }
