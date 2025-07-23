import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const sqlite = new Database('studyapp.db');
export const db = drizzle(sqlite, { schema });

// Função para inicializar o banco
export async function initDatabase() {
  try {
    // Criar tabelas se não existirem
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        schedule TEXT,
        syllabus TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'todo',
        difficulty INTEGER,
        estimated_time INTEGER,
        actual_time INTEGER,
        points INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        completed_at INTEGER,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      );

      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        total_points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        last_activity INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT,
        points INTEGER DEFAULT 0,
        unlocked_at INTEGER
      );
    `);
    
    console.log('Database initialized!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    throw error;
  }
}
