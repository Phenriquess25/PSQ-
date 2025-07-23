import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Tabela de Cursos
export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tabela de Disciplinas
export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id),
  name: text('name').notNull(),
  description: text('description'),
  schedule: text('schedule'), // JSON com horários
  syllabus: text('syllabus'), // Ementa gerada por IA
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tabela de Tasks (Kanban)
export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo'), // 'todo', 'doing', 'done'
  difficulty: integer('difficulty'), // 1-5, avaliado por IA
  estimatedTime: integer('estimated_time'), // em minutos, sugerido por IA
  actualTime: integer('actual_time'), // tempo real gasto
  points: integer('points').default(0), // pontos ganhos
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// Tabela de Usuário (para gamificação)
export const user = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  totalPoints: integer('total_points').default(0),
  level: integer('level').default(1),
  xp: integer('xp').default(0),
  streak: integer('streak').default(0), // dias consecutivos
  lastActivity: integer('last_activity', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tabela de Conquistas
export const achievements = sqliteTable('achievements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon'),
  points: integer('points').default(0),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }),
});

// Relações
export const coursesRelations = relations(courses, ({ many }) => ({
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  course: one(courses, {
    fields: [subjects.courseId],
    references: [courses.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  subject: one(subjects, {
    fields: [tasks.subjectId],
    references: [subjects.id],
  }),
}));
